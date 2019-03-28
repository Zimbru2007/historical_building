FROM python:3.7
ENV PYTHONUNBUFFERED=1
RUN mkdir /data
WORKDIR /data
ADD conf/requirements.txt /data/
RUN pip install -r requirements.txt
RUN mkdir /data/conf
ADD conf/init.sh /data/conf/