#import "p2ptunnel.h"
#import "P2PTunnelAPIs.h"

//@interface P2PTunnel () {}
//@end

@implementation P2PTunnel


@synthesize managedObjectContext = __managedObjectContext;
@synthesize managedObjectModel = __managedObjectModel;
@synthesize persistentStoreCoordinator = __persistentStoreCoordinator;

typedef struct st_AuthData
{
    char szUsername[64];
    char szPassword[64];
} sAuthData;

int gPortMappingIndex;
int gSID;
int gTunnelStatus;
int gMappedPort;

- (void)startP2PTunnel:(CDVInvokedUrlCommand*)command
{
    NSString* uid = [[command arguments] objectAtIndex:0];
    
    [self.commandDelegate runInBackground:^{
        // Some blocking logic...
        [self StartTunnel:uid];
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%d", gMappedPort]];
        // The sendPluginResult method is thread-safe.
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)stopP2PTunnel:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:nil];
    
    [self StopTunnel];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) StartTunnel:(NSString*)uid
{
    gTunnelStatus = -40000;
    
    [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
    
    
    sAuthData authData;
    strcpy(authData.szUsername, "Tutk.com");
    strcpy(authData.szPassword, "P2P Platform");
    
    P2PTunnelAgentInitialize(4);
    
    int nErrFromDevice;
    int gSID = P2PTunnelAgent_Connect([uid UTF8String], (void *)&authData, sizeof(sAuthData), &nErrFromDevice);
    
    
    if(gSID > -1)
    {
        NSLog(@"P2PTunnelAgent_Connect success!");
        
        NSLog(@"Start to find a port to map.");
        gPortMappingIndex = -1;
        for(int i = 0; i < 100; i++) //try 100 ports for mapping.
        {
            gMappedPort = 10080 + i;
            
            gPortMappingIndex = P2PTunnelAgent_PortMapping(gSID, gMappedPort, 10080);
            if(gPortMappingIndex < 0)
            {
                NSLog(@"P2PTunnelAgent_PortMapping %d failed : %d", gMappedPort, gPortMappingIndex);
            }
            else
            {
               break;
            }
        }
        //gPortMappingIndex = P2PTunnelAgent_PortMapping(gSID, 10080, 10080);
        NSLog(@"End port mapping, gMappedPort = %d", gMappedPort);
        
        if(gPortMappingIndex > 0)
        {
            gTunnelStatus = gSID;
        }
        else
            gTunnelStatus = gPortMappingIndex;
    }
    else
    {
        NSLog(@"P2PTunnelAgent_Connect failed ret[%d] error[%d]\n", gSID, nErrFromDevice);
        gTunnelStatus = gSID;
    }
    
    [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
    return;
}

- (void) StopTunnel
{
    NSLog(@"StopTunnel Start");
    
    if(gPortMappingIndex > 0)
        P2PTunnelAgent_StopPortMapping((unsigned int)gPortMappingIndex);
    
    P2PTunnelAgent_Disconnect(gSID);
    P2PTunnelAgentDeInitialize();
    
    NSLog(@"StopTunnel End");
}

- (int) GetTunnelStatus
{
    return gTunnelStatus;
}

- (int) GetMappedPort
{
    return gMappedPort;
}

@end