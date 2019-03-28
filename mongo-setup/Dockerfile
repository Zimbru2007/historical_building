FROM mongo:4
WORKDIR /usr/src/configs

COPY mongo-setup.js .
COPY mongo-setup.sh .

CMD [ "./mongo-setup.sh"]