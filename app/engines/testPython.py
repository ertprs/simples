import sys
import chilkat

pfx = chilkat.CkPfx()

success = pfx.LoadPfxFile("D:/NODE/Projects/certificados/ROMULO_MELO_RAMOS_LTDA_36061458000106_1579802184556881800.pfx","12345678")
if (success != True):
    print(pfx.lastErrorText())
    sys.exit()

strPem = pfx.toPem()
print(strPem)
