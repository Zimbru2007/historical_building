FROM python:3.7
ENV PYTHONUNBUFFERED=1
RUN mkdir /data
WORKDIR /data
ADD conf/requirements.txt /data/
RUN pip install -r requirements.txt
RUN pip install git+https://github.com/lasircc/djongo.git@django2.2
RUN echo "deb [check-valid-until=no] http://archive.debian.org/debian jessie-backports main" > /etc/apt/sources.list.d/jessie-backports.list
RUN sed -i '/deb http:\/\/deb.debian.org\/debian jessie-updates main/d' /etc/apt/sources.list
RUN apt-get -o Acquire::Check-Valid-Until=false update && apt-get install -y gettext libgettextpo-dev
RUN mkdir /data/conf
ADD conf/init.sh /data/conf/