import './scss/styles.scss';
import { EventEmitter } from './components/base/events';

//единый «телефон» (events), по которому разные 
//кусочки проекта могут общаться, не зная друг о друге напрямую  
export const events = new EventEmitter();
