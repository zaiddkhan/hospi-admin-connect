
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { User, Mail, Id } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Profile = () => {
  const { data: profile, isLoading, error } = useProfile();

  // Function to get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>

        {isLoading ? (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-destructive mb-4">Failed to load profile information</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        ) : profile ? (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.name} />
                    ) : null}
                    <AvatarFallback className="text-lg">{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{profile.name}</CardTitle>
                    <CardDescription>{profile.role}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span>{profile.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Id className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">User ID:</span>
                  <span className="font-mono">{profile.id}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Account created:</span>
                  <span>
                    {profile.created_at 
                      ? format(new Date(profile.created_at), 'PPP') 
                      : 'Not available'}
                  </span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <Button variant="outline">Edit Profile</Button>
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppLayout>
  );
};

export default Profile;
