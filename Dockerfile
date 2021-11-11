FROM node:14

RUN mkdir /project
WORKDIR /project
COPY requirements.txt /project/requirements.txt

RUN apt-get update
RUN apt-get install --yes python3 
RUN apt-get -y install python3-pip 
RUN pip3 install -r requirements.txt

RUN mkdir /opt/app
WORKDIR /opt/app
COPY package.json package-lock.json ./

RUN npm cache clean --force && npm install

COPY . /opt/app

CMD [ "npm", "start" ]
