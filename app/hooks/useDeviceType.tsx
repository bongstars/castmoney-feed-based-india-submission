import { useState, useEffect } from 'react';

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

	useEffect(() => {
		const updateDeviceType = () => {
			const width = window.innerWidth;
			if (width >= 1024) {
				setDeviceType('desktop');
			} else if (width >= 768) {
				setDeviceType('tablet');
			} else {
				setDeviceType('mobile');
			}
		};

		updateDeviceType(); // Set initial device type
		window.addEventListener('resize', updateDeviceType);

		return () => {
			window.removeEventListener('resize', updateDeviceType);
		};
	}, []);

  return deviceType;
}
