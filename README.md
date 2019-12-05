# app-ancile

A Databox app to say Hello


## Description

In the current version of this app is for understanding "how to create an app"

## Databox Instructions

First make sure that [Docker](https://www.docker.com) is installed to your system.

Create a project folder (e.g. `databox-myapp`) that will host everything.

Git clone [Databox](https://github.com/me-box/databox) into `databox-myapp\databox_dev` using `$ git clone git@github.com:me-box/databox.git databox_dev`.

Git clone [app-pii](https://github.com/adhatarao/app-pii) into `databox-myapp\app-pii` using `$ git clone git@github.com:adhatarao/app-pii.git`.

Start Databox using `$ docker run --rm -v /var/run/docker.sock:/var/run/docker.sock --network host -t databoxsystems/databox:0.5.2 /databox start -sslHostName $(hostname)`.

Wait until databox is loaded and login to http://127.0.0.1 (non https version). Download and install the certificate. Click at "DATABOX DASHBOARD".

Make sure that Databox runs correctly and you can login without any issues (password is random and you can copy it from the terminal).

You can now stop Databox using `$ docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -t databoxsystems/databox:0.5.2 /databox stop`.

Copy `app-pii` folders into `databox_dev\build`.

Under `databox_dev`, run `$ ./databox-install-component app-pii databoxsystems 0.5.2`.

Start Databox again and go to: `My App -> App Store` and upload the two manifests (`databox-manifest.json`) from `app-pii` folders. The new app will now appear in the App Store.

Go to the App Store and install `app-pii`.

