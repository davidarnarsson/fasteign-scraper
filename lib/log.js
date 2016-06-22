import winston from 'winston'; 

winston.setLevels(winston.config.syslog.levels);

// do nothing for now..

export default winston;