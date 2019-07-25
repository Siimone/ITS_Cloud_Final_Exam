echo "[ UPDATE ]"
sudo apt-get update

# Generic dependencies
sudo apt -y install build-essential tcl curl wget

# Redis
echo "[ START REDIS ]"
sudo apt -y install redis-server
sudo systemctl enable redis-server.service
echo "[ END REDIS ]"

# PostgreSQL
echo "[ START POSTGRESQL ]"
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
RELEASE=$(lsb_release -cs)
echo "deb http://apt.postgresql.org/pub/repos/apt/ ${RELEASE}"-pgdg main | sudo tee  /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt -y install postgresql-11
su - postgres
psql
\password postgres
echo "[ END POSTGRESQL ]"

# RabbitMQ
echo "[ START RABBIT ]"
echo 'deb http://www.rabbitmq.com/debian/ testing main' | sudo tee /etc/apt/sources.list.d/rabbitmq.list
wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y rabbitmq-server
sudo update-rc.d rabbitmq-server defaults
sudo service rabbitmq-server start
sudo rabbitmqctl add_user simo simo
sudo rabbitmqctl set_user_tags simo administrator
sudo rabbitmqctl set_permissions -p / simo ".*" ".*" ".*"
sudo rabbitmq-plugins enable rabbitmq_management
echo "[ END RABBIT ]"

# NodeJS
echo "[ START NODEJS ]"
sudo apt -y install curl python-software-properties
curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
sudo apt-get install -y nodejs
node -v
npm -v
echo "[ END NODEJS ]"

# Apache2
sudo apt-get install -y apache2
sudo service apache2 restart

rm /etc/postgresql/11/main/postgresql.conf
rm /etc/postgresql/11/main/pg_hba.conf
rm /etc/redis/redis.conf
rm /var/www/html/.htaccess

wget https://gist.githubusercontent.com/julianpoemp/bcf277cb56d2420cc53ec630a04a3566/raw/85f32322158a6a9ffed71a6a32844373b1049780/.htaccess -P /var/www/html/
wget https://gist.githubusercontent.com/Siimone/b8063cbd94dbea948bd4683d20432cdd/raw/81f84835abf5e563167456930baf96b36273f05d/pg_hba.conf -P /etc/postgresql/11/main
wget https://gist.githubusercontent.com/Siimone/317894cde963831af7c792b59b8416d2/raw/76e65e8fbe9884f649e3044b34dff86ad23671eb/postgresql.conf -P /etc/postgresql/11/main/
wget https://gist.githubusercontent.com/Siimone/f521d35517e1e7b7573c9f0e26b35178/raw/e1b413464a0c1140981b36bb94675e267512faa6/redis.conf -P /etc/redis/

service postgresql restart
service apache2 restart
service redis-server restart
service rabbitmq-server start

chown -R ubuntu:ubuntu /var/www/html/