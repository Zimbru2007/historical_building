FROM python:3.7
ENV PYTHONUNBUFFERED=1
RUN mkdir /data
WORKDIR /data
ADD conf/requirements.txt /data/
RUN pip install -r requirements.txt
RUN pip install git+https://github.com/lasircc/djongo.git@django2.2
RUN mkdir /data/conf
ADD conf/init.sh /data/conf/