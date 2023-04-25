## Table of contents
- [Set up](#set-up)
- [Start the server and keep it running](#start-the-server-and-keep-it-running)

## Set up
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
Create **`/etc/yum.repos.d/mongodb-org-6.0.repo`**
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
### Install project's dependencies
```shell
npm install
```

## Start the server and keep it running
### With [forever](https://github.com/foreversd/forever)
#### Install forever
```shell
sudo npm install forever -g
```
#### Start the server
```shell
forever start index.js
```
#### To stop the server
```shell
forever stop index.js
```
### Alternatively
Before starting the server run the following to produce a persistent environement:
```shell
screen
```
When reconnecting to EC2 instance run the following to reconnect to that environment:
```shell
screen -r
```
