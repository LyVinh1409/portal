FROM golang:1.20-alpine AS builder
WORKDIR /app
ENV CGO_ENABLED=0
COPY go.mod go.sum ./
RUN apk add --no-cache git
RUN go mod download
COPY . .
RUN go build -o /app/bin/server ./cmd/server

FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/bin/server /usr/local/bin/server
EXPOSE 8080
ENV PORT=8080
CMD ["/usr/local/bin/server"]
