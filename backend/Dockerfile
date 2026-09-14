# Build Stage
FROM golang:1.26-alpine AS builder

# السماح لـ Go بتحميل النسخة المطلوبة تلقائياً إذا تطلبت الحزم ذلك
ENV GOTOOLCHAIN=auto

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Run Stage
FROM alpine:latest

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]