import sys
import chilkat

pfx = chilkat.CkPfx()

success = pfx.LoadPfxFile("D:/NODE/Projects/certificados/certificado.pfx","66583714")
if (success != True):
    print(pfx.lastErrorText())
    sys.exit()

strPem = pfx.toPem()
print(strPem)
