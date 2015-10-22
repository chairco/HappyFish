#import <Cordova/CDV.h>

@interface P2PTunnel : CDVPlugin

- (void)startP2PTunnel:(CDVInvokedUrlCommand*)command;
- (void)stopP2PTunnel:(CDVInvokedUrlCommand*)command;

@property (readonly, strong, nonatomic) NSManagedObjectContext *managedObjectContext;
@property (readonly, strong, nonatomic) NSManagedObjectModel *managedObjectModel;
@property (readonly, strong, nonatomic) NSPersistentStoreCoordinator *persistentStoreCoordinator;

- (int) GetTunnelStatus;
- (int) GetMappedPort;

@end