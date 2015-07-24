mkdir certs
cd certs
openssl genrsa -out quiz-2015-ejc-key.pem 2048
openssl req -new -sha256 -key quiz-2015-ejc-key.pem -out quiz-2015-ejc-csr.pem
openssl x509 -req -in quiz-2015-ejc-csr.pem -signkey quiz-2015-ejc-key.pem -out quiz-2015-ejc-cert.pem
# I used all default values for the information incorporated into certificate request. 
# Challenge password: quiz-2015-ejc
