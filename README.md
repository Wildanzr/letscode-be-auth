# LetsCode Auth

# Setting up RabbitMQ
1. Install required app
```
apt-get install curl gnupg apt-transport-https -y
```
2. Add repository signing keys
```
curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" | sudo gpg --dearmor | sudo tee /usr/share/keyrings/com.rabbitmq.team.gpg > /dev/null
curl -1sLf "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xf77f1eda57ebb1cc" | sudo gpg --dearmor | sudo tee /usr/share/keyrings/net.launchpad.ppa.rabbitmq.erlang.gpg > /dev/null
curl -1sLf "https://packagecloud.io/rabbitmq/rabbitmq-server/gpgkey" | sudo gpg --dearmor | sudo tee /usr/share/keyrings/io.packagecloud.rabbitmq.gpg > /dev/null
```
3. Create a new file ```sudo nano /etc/apt/sources.list.d/rabbitmq.list```
4. Fill the file with
```
deb [signed-by=/usr/share/keyrings/net.launchpad.ppa.rabbitmq.erlang.gpg] http://ppa.launchpad.net/rabbitmq/rabbitmq-erlang/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/net.launchpad.ppa.rabbitmq.erlang.gpg] http://ppa.launchpad.net/rabbitmq/rabbitmq-erlang/ubuntu jammy main
deb [signed-by=/usr/share/keyrings/io.packagecloud.rabbitmq.gpg] https://packagecloud.io/rabbitmq/rabbitmq-server/ubuntu/ jammy main
deb-src [signed-by=/usr/share/keyrings/io.packagecloud.rabbitmq.gpg] https://packagecloud.io/rabbitmq/rabbitmq-server/ubuntu/ jammy main
```
5. Apt update
6. Install erlang
```
sudo apt install -y erlang-base \
    erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
    erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
    erlang-runtime-tools erlang-snmp erlang-ssl \
    erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl
```
7. Install RabbitMQ-server
```
sudo apt install rabbitmq-server -y --fix-missing
```
8. Check status
```
sudo systemctl status rabbitmq-server
```
9. Enable management service
```
sudo rabbitmq-plugins enable rabbitmq_management
```
10. Add user and password, then set to admin
```
sudo rabbitmqctl add_user wildanzr mySeCur3p455w0rd
sudo rabbitmqctl set_user_tags wildanzr administrator
```

# Create Google Cloud Bucket
1. Create a Google Cloud Bucket
2. Go to bucket permissions, then add grant access
3. Set new principals to allUsers
4. Set role to Storage Object Viewer
5. Save

# Create Google Cloud Service Account
1. Go to API & Services > Cloud Storage
2. Click on Create Credentials
3. Create a Service Account Credential
4. Fill in the details
5. Set the role to Storage > Storage Object Admin
6. Click on Create
7. Click on the Service Account
8. Go to Keys tab
9. Click on Add Key
10. Select JSON
11. Click on Create

# Disable Cloud Storage CORS
1. Go to cloud shell
2. Edit and paste this script:
```
printf '[{"origin": ["*"],"responseHeader": ["*"],"method":
["GET","POST","PUT","DELETE","HEAD"],"maxAgeSeconds": 86400}]' > cors.json

gsutil cors set cors.json gs://letscode-cloud
```
3. Run the script
4. Authorize the script