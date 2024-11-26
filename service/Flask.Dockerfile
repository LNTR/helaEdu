FROM python:3.10-slim
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8081

EXPOSE 8081
WORKDIR /usr/src/

COPY . ./

RUN pip install --upgrade pip
RUN pip install bs4
RUN pip install fireo
RUN pip install Flask
RUN pip install firebase-admin
RUN pip install scikit-learn
# RUN pip install --no-cache-dir -r requirements.txt


VOLUME [ "/usr/src/" ]

CMD [ "flask","run"]