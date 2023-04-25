### Start the server on EC2 and keep it running
#### Install [Forever](https://github.com/foreversd/forever)
```shell
npm install forever -g
```
#### Start the server
```shell
forever start index.js
```

### Install NodeJS
```shell
# Update the system packages
sudo yum update -y

# Install dependencies packages
sudo yum install gcc-c++ make -y

# Install Node.js repository 16.x
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -

# update the system
sudo yum update -y

# Install Node.js
sudo yum install nodejs -y
```

### Install MongoDB
Create '/etc/yum.repos.d/mongodb-org-6.0.repo'
```
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
```
```shell
sudo yum install -y mongodb-org
```
