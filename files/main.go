package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

func main() {
	fmt.Println("server started on port 5001")
	http.HandleFunc("/", handler())
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	err := http.ListenAndServe(":5001", nil)

	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("server closed\n")
	} else if err != nil {
		fmt.Printf("error starting server: %s\n", err)
		os.Exit(1)
	}

}

func handler() func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ip, err := getIP(r)
		if err != nil {
			panic(err)
		}
		if ip == "::1" {
			ip = "127.0.0.1"
		}
		// w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, POST")

		//******************
		//!
		//!	UPLOAD
		//!
		//******************

		if (r.Method == http.MethodPost || r.Method == "POST") && (r.URL.Path == "/api/upload" || r.URL.Path == "/api/upload/") {
			w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin")
			const MAX_UPLOAD_SIZE = 1024 * 1024 * 5 // 5MB
			if r.Method != "POST" {
				http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
				return
			}

			if err := r.ParseMultipartForm(32 << 20); err != nil {
				fmt.Printf("%+v\n", r.Body)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			var paths []string

			files := r.MultipartForm.File["file"]

			for _, fileHeader := range files {
				if fileHeader.Size > MAX_UPLOAD_SIZE {
					http.Error(w, fmt.Sprintf("The uploaded image is too big: %s.", fileHeader.Filename), http.StatusBadRequest)
					return
				}

				filename := url.QueryEscape(fileHeader.Filename)

				file, err := fileHeader.Open()
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				defer file.Close()

				buff := make([]byte, 512)
				_, err = file.Read(buff)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				filetype := http.DetectContentType(buff)
				if filetype != "image/jpeg" && filetype != "image/jpg" && filetype != "image/png" && filetype != "image/gif" && filetype != "image/webp" && filetype != "image/svg+xml" && filetype != "image/svg" {
					http.Error(w, "The provided file format is not allowed.", http.StatusBadRequest)
					return
				}

				_, err = file.Seek(0, io.SeekStart)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				err = os.MkdirAll("./uploads", os.ModePerm)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}

				time := time.Now().UnixNano()
				random := strconv.Itoa(rand.Intn(69420))

				insertedPath := fmt.Sprintf("./uploads/%d--%s--%s", time, random, filename)
				filePath := fmt.Sprintf("http://localhost:5001/uploads/%d--%s--%s", time, random, filename)
				// resizedPath := fmt.Sprintf("./uploads/resized_%d--%s--%s", time.Now().UnixNano(), strconv.Itoa(rand.Intn(69420)), filename)

				paths = append(paths, filePath)

				f, err := os.Create(insertedPath)

				if err != nil {
					http.Error(w, err.Error(), http.StatusBadRequest)
					return
				}

				defer f.Close()

				_, err = io.Copy(f, file)
				if err != nil {
					http.Error(w, err.Error(), http.StatusBadRequest)
					return
				}

				fmt.Println("here 7")

				fmt.Printf("File uploaded: %s\n", insertedPath)

			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			_json, err := json.Marshal(paths)
			if err != nil {
				panic(err)
			}

			if _json != nil {
				io.WriteString(w, string(_json))
			}
		}
	}
}

func getIP(r *http.Request) (string, error) {
	ip := r.Header.Get("X-REAL-IP")
	netIP := net.ParseIP(ip)
	if netIP != nil {
		return ip, nil
	}

	ips := r.Header.Get("X-FORWARDED-FOR")
	splitIps := strings.Split(ips, ",")
	for _, ip := range splitIps {
		netIP := net.ParseIP(ip)
		if netIP != nil {
			return ip, nil
		}
	}

	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return "", err
	}
	netIP = net.ParseIP(ip)
	if netIP != nil {
		return ip, nil
	}

	return "", errors.New("no valid ip found")
}

type Progress struct {
	TotalSize int64
	BytesRead int64
}
