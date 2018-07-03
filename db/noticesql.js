let NoticeSQL = {
    selectNoticesByPage: function (title) {
        let sql = `SELECT notice_id AS noticeId,title,app_id AS appId,front,notice_state AS noticeState,creator_id AS creatorId,create_time AS createTime,editor_id AS editorId,edit_time AS editTime,content FROM pub_notice  ORDER BY front DESC,create_time DESC limit ?,?`;
        if (title) {
            sql = `SELECT notice_id AS noticeId,title,app_id AS appId,front,notice_state AS noticeState,creator_id AS creatorId,create_time AS createTime,editor_id AS editorId,edit_time AS editTime,content FROM pub_notice WHERE title like '%${title}%' ORDER BY front DESC,create_time DESC limit ?,?`;
        }
        return sql;
    },
    countNoticesForPage: function (title) {
      let sql = `select count(notice_id) as total from pub_notice`;
      if (title) {
          sql = `select count(notice_id) as total from pub_notice where title like '%${title}%'`;
      }
      return sql;
    },
    insertNotice: 'INSERT INTO pub_notice (title,front,notice_state,creator_id,create_time,content,notice_id) VALUES ( ?,?,?,?,?,?,? )',
    updateNotice: 'UPDATE pub_notice SET title = ?, front = ?, notice_state = ?, editor_id = ?, edit_time = ?, content = ? WHERE notice_id = ? ',
    selectOneNoticeById: 'SELECT notice_id AS noticeId,title,app_id AS appId,front,notice_state AS noticeState,creator_id AS creatorId,create_time AS createTime,editor_id AS editorId,edit_time AS editTime,content FROM pub_notice WHERE (notice_id = ? )',
    deleteNotice: 'DELETE FROM pub_notice WHERE (notice_id = ? )',
    updateNoticeState: 'UPDATE pub_notice SET notice_state = ? WHERE notice_id = ?',
    selectAllNotices: 'SELECT notice_id AS noticeId,title,app_id AS appId,front,notice_state AS noticeState,creator_id AS creatorId,create_time AS createTime,editor_id AS editorId,edit_time AS editTime,content FROM pub_notice  ORDER BY front DESC,create_time DESC',
    selectPreNoticeId: 'SELECT notice_id AS noticeId,title FROM pub_notice WHERE (create_time > ? ) ORDER BY front DESC,create_time DESC limit 1',
    selectNextNoticeId: 'SELECT notice_id AS noticeId,title FROM pub_notice WHERE (create_time < ? ) ORDER BY front DESC,create_time DESC limit 1'
};
module.exports = NoticeSQL;