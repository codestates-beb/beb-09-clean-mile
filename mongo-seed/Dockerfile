FROM mongo:7.0.0-rc8

COPY init.json /init.json

CMD mongoimport --uri mongodb://root:example@mongo:27017 --authenticationDatabase=admin -d clean-mile -c users --type json --file /init.json --jsonArray
