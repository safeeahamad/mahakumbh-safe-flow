import React from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import CameraFeed from '@/components/dashboard/CameraFeed';
import AlertPanel from '@/components/dashboard/AlertPanel';
import CrowdChart from '@/components/dashboard/CrowdChart';
import { Users, AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import cameraFeed1 from '@/assets/camera-feed-1.jpg';
import cameraFeed2 from '@/assets/camera-feed-2.jpg';
import cameraFeed3 from '@/assets/camera-feed-3.jpg';
import cameraFeed4 from '@/assets/camera-feed-4.jpg';

const DashboardHome = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Current Attendance"
          value="45,832"
          icon={Users}
          trend="+2,340 in last hour"
          status="moderate"
        />
        <StatsCard
          title="Peak Today"
          value="52,150"
          icon={TrendingUp}
          trend="At 11:30 AM"
          status="high"
        />
        <StatsCard
          title="Active Alerts"
          value="3"
          icon={AlertTriangle}
          status="critical"
        />
        <StatsCard
          title="Staff Deployed"
          value="156"
          icon={Shield}
          status="safe"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Camera Feeds */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Live Camera Feeds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CameraFeed
                name="Camera 1"
                location="Gate 1 - North Entrance"
                crowdCount={12340}
                image={cameraFeed1}
              />
              <CameraFeed
                name="Camera 2"
                location="Gate 2 - South Entrance"
                crowdCount={10580}
                image={cameraFeed2}
              />
              <CameraFeed
                name="Camera 3"
                location="Main Temple Area"
                crowdCount={15920}
                image={cameraFeed3}
              />
              <CameraFeed
                name="Camera 4"
                location="Parking Zone A"
                crowdCount={6992}
                image={cameraFeed4}
              />
            </div>
          </div>

          {/* Crowd Chart */}
          <CrowdChart />
        </div>

        {/* Right Column - Alerts */}
        <div className="space-y-6">
          <AlertPanel />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
