import {conn} from "../server";
import {utilToken} from "../util/utilToken";

export const searchFriend = (req: any, res: any) => {
    const {str} = req.body;
    const {id} = utilToken.extractToken(req.get('token'));

    const sqlSearch = `SELECT name, email, id FROM user WHERE name LIKE '${str}' OR email = '${str}'`;

    conn.query(sqlSearch, (err, searchResults) => {
        if(err) throw err;

        res.status(200);
        return res.json({data: searchResults});
    })
};

export const sendFriendship = (req: any, res: any) => {
    const {friendId, note} = req.body;
    const {id} = utilToken.extractToken(req.get('token'));

    const sqlVerifyUsers = `SELECT email FROM user WHERE id IN ('${id}', '${friendId}')`;
    const sqlIsAlreadyFriend = `SELECT active FROM friends WHERE (fromId = '${id}' AND toId = '${friendId}') OR (fromId = '${friendId}' AND toId = '${id}')`;
    const sqlCreateFrndRequest = `INSERT INTO friends (message, fromId, toId) VALUES ('${note}', '${id}', '${friendId}')`;

    conn.query(sqlVerifyUsers, (err, users) => {
        if (err) throw err;

        if(users.length !== 2) {
            res.status(409);
            return res.json({msg: "Authentication failed for selected users"})
        }
        conn.query(sqlIsAlreadyFriend, (err, friend) => {
            if (err) throw err;

            if(friend[0]){
                res.status(200);
                return res.json({msg: "Friendship in process! Either you have already sent a request or you have his/her friend request pending"});
            }

            conn.query(sqlCreateFrndRequest, (err) => {
                if (err) throw err;

                res.status(201);
                return res.json({msg: "Friend request is sent!"});
            })
        })
    })
};

export const acceptFriendRequest = (req: any, res: any) => {
    const {friendId} = req.body;
    const {id} = utilToken.extractToken(req.get('token'));

    const sqlAcceptRequest = `UPDATE friends SET active = 'true', updatedAt = '${new Date().toLocaleString()}' WHERE fromId = '${friendId}' AND toId = '${id}' AND active = 'false'`;

    conn.query(sqlAcceptRequest, (err, updt) => {
        if(err) throw err;

        res.status(200);
        return res.json({data: updt, msg: 'Fried request accepted!'})
    })
};

export const getPendingFriendship = (req: any, res: any) => {
    const {id} = utilToken.extractToken(req.get('token'));

    const sqlPendingRequests = `SELECT ur.id, name, email 
                                FROM friends fr JOIN user ur 
                                ON fr.fromId = ur.id 
                                WHERE fr.toId = '${id}' AND active = 'false'`;

    conn.query(sqlPendingRequests, (err, users) => {
        if (err) throw err;

        res.status(200);
        return res.json({data: users})
    })
};
