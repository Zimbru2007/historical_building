rsconf = {
    _id : "rshb",
    members: [
        {
            "_id": 0,
            "host": "hbmongodb1:27017",
            "priority": 3
        },
        {
            "_id": 1,
            "host": "hbmongodb2:27017",
            "priority": 2
        },
        {
            "_id": 2,
            "host": "hbmongodb3:27017",
            "priority": 1
        }
    ]
}

rs.initiate(rsconf);
rs.conf();