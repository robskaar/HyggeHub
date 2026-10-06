// HyggeHub entry point. One module registers the theme engine, every card and the Appearance panel,
// so Home Assistant needs a single dashboard resource and the panel's module_url points at the same file.
import { engine } from './theme/engine';
import './cards/header-card';
import './cards/notification-stack-card';
import './cards/room-card';
import './cards/alarm-card';
import './cards/countdown-card';
import './cards/lists-card';
import './cards/weather-card';
import './cards/media-card';
import './cards/appliance-card';
import './cards/energy-card';
import './cards/family-card';
import './cards/bins-card';
import './panel/appearance-panel';

export const VERSION = '0.1.0';

// Pick up the signed-in user as early as possible, before any card has rendered, so the right
// look is applied on the first frame of a dashboard rather than after the first card's update.
const ha = document.querySelector('home-assistant') as (HTMLElement & { hass?: any }) | null;
if (ha?.hass) engine.setHass(ha.hass);

console.info(`%c HyggeHub %c ${VERSION} `, 'background:#2F6E86;color:#fff;border-radius:4px 0 0 4px;padding:2px 6px', 'background:#DCE3E5;color:#18242A;border-radius:0 4px 4px 0;padding:2px 6px');
