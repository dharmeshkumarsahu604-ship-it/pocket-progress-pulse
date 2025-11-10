import { ReactNode, useEffect, useState } from 'react';
import { usePermissions, PermissionType } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Mic, MapPin, HardDrive, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PermissionGateProps {
  children: ReactNode;
  permissions: PermissionType[];
  title?: string;
  description?: string;
  onPermissionGranted?: () => void;
}

const permissionIcons: Record<PermissionType, any> = {
  camera: Camera,
  microphone: Mic,
  geolocation: MapPin,
  storage: HardDrive,
};

const permissionLabels: Record<PermissionType, string> = {
  camera: 'Camera',
  microphone: 'Microphone',
  geolocation: 'Location',
  storage: 'Storage',
};

const permissionDescriptions: Record<PermissionType, string> = {
  camera: 'Take photos of rocks and minerals for identification',
  microphone: 'Record voice notes during field work',
  geolocation: 'Tag your location in field notes and find nearby geological sites',
  storage: 'Save your field notes, photos, and collections',
};

export const PermissionGate = ({ 
  children, 
  permissions: requiredPermissions,
  title = 'Permissions Required',
  description = 'This feature needs access to the following:',
  onPermissionGranted 
}: PermissionGateProps) => {
  const { permissions, requestMultiplePermissions } = usePermissions();
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasRequestedOnce, setHasRequestedOnce] = useState(false);

  const allGranted = requiredPermissions.every(
    type => permissions[type].status === 'granted'
  );

  useEffect(() => {
    if (allGranted && hasRequestedOnce && onPermissionGranted) {
      onPermissionGranted();
    }
  }, [allGranted, hasRequestedOnce, onPermissionGranted]);

  const handleRequestPermissions = async () => {
    setIsRequesting(true);
    await requestMultiplePermissions(requiredPermissions);
    setIsRequesting(false);
    setHasRequestedOnce(true);
  };

  if (allGranted) {
    return <>{children}</>;
  }

  const deniedPermissions = requiredPermissions.filter(
    type => permissions[type].status === 'denied'
  );

  return (
    <div className="container max-w-2xl mx-auto p-6 min-h-screen flex items-center justify-center animate-fade-in">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiredPermissions.map((type) => {
            const Icon = permissionIcons[type];
            const status = permissions[type].status;
            
            return (
              <div 
                key={type}
                className="flex items-start gap-3 p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <div className={`p-2 rounded-full ${
                  status === 'granted' 
                    ? 'bg-success/10 text-success' 
                    : status === 'denied'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-muted'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{permissionLabels[type]}</h3>
                    {status === 'granted' && (
                      <span className="text-xs text-success">✓ Granted</span>
                    )}
                    {status === 'denied' && (
                      <span className="text-xs text-destructive">✗ Denied</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {permissionDescriptions[type]}
                  </p>
                  {status === 'denied' && permissions[type].error && (
                    <p className="text-xs text-destructive mt-2">
                      {permissions[type].error}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {deniedPermissions.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Some permissions were denied. Please enable them in your browser settings to use this feature.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleRequestPermissions}
            disabled={isRequesting || deniedPermissions.length > 0}
            className="w-full"
            size="lg"
          >
            {isRequesting ? 'Requesting Permissions...' : 'Grant Permissions'}
          </Button>

          {deniedPermissions.length > 0 && (
            <p className="text-xs text-center text-muted-foreground">
              Please update your browser settings and reload the page
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
