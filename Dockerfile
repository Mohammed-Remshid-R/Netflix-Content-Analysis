FROM python:3.11

WORKDIR /app

COPY . .

RUN apt-get update && \
    apt-get install -y nodejs npm

RUN pip install --no-cache-dir -r requirements.txt

RUN cd frontend && npm install

RUN cd frontend && npm run build

EXPOSE 7860

CMD ["gunicorn", "--bind", "0.0.0.0:7860", "backend.app:app"]