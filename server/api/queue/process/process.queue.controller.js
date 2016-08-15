'use strict';

import Queue from '../queue.model';
import jwt from 'jsonwebtoken';
import config from '../../../config/environment';

// add to queue
export function addToQueue(req, res) {
	var token = req.body.token;
    if (!token) {
        return res.json({ response: 'unauthorized' });
    }

	var decoded_user = jwt.verify(token, config.secrets.session);

    if (!decoded_user) {
        return res.json({ response: 'unauthorized' });
    }
    
	return res.json({ user_id: decoded_user._id });
}
