FROM golang:1.24-alpine AS build

WORKDIR /src
COPY go.mod ./
COPY cmd ./cmd
RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/converseai-api ./cmd/api

FROM alpine:3.21

RUN adduser -D -u 10001 appuser
USER appuser
COPY --from=build /bin/converseai-api /usr/local/bin/converseai-api
EXPOSE 8080
ENTRYPOINT ["converseai-api"]
