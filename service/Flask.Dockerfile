FROM python:3

ENV FLASK_APP=app.py
ENV FLASk_ENV=production
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=8081

EXPOSE 8081
WORKDIR /usr/src/

COPY . ./

RUN pip install --upgrade pip
RUN pip install setuptools
RUN pip install -r requirements.txt
VOLUME [ "/usr/src/" ]

CMD [ "flask","run"]