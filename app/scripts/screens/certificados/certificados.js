var os = require('os');
if (os.platform() == 'win32') {  
    if (os.arch() == 'ia32') {
        var chilkat = require('@chilkat/ck-node11-win-ia32');
    } else {
        var chilkat = require('@chilkat/ck-node11-win64'); 
    }
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('@chilkat/ck-node11-arm');
    } else if (os.arch() == 'x86') {
        var chilkat = require('@chilkat/ck-node11-linux32');
    } else {
        var chilkat = require('@chilkat/ck-node11-linux64');
    }
} else if (os.platform() == 'darwin') {
    var chilkat = require('@chilkat/ck-node11-macosx');
}

function chilkatExample() {

    var pfx = new chilkat.Pfx();

    // Load the PKCS12 from a file
    var success = pfx.LoadPfxFile("/someDir/my.p12","pfxFilePassword");
    if (success !== true) {
        console.log(pfx.LastErrorText);
        return;
    }

    var numPrivateKeys = pfx.NumPrivateKeys;

    // privKey: PrivateKey
    var privKey;

    console.log("Private Keys:");

    var i = 0;
    while (i < numPrivateKeys) {
        privKey = pfx.GetPrivateKey(i);

        // Do something with the private key ...

        i = i+1;
    }

    // cert: Cert
    var cert;

    var numCerts = pfx.NumCerts;

    console.log("Certs:");
    i = 0;
    while (i < numCerts) {
        cert = pfx.GetCert(i);
        console.log(cert.SubjectDN);

        // If the certificate has a private key (one of the private keys within the PFX)
        // then it can also be obtained via the certificate object:
        if (cert.HasPrivateKey() == true) {

            console.log("Has private key!");

            privKey = cert.ExportPrivateKey();
            // ...

        }

        i = i+1;
    }


}

chilkatExample();