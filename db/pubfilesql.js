let PubFileSSQL = {
    uploadFile: 'INSERT INTO pub_file (file_id,file_name,file_path,file_cls,create_time) VALUES ( ?,?,?,?,?)',
    deleteFile: 'DELETE FROM pub_file WHERE file_id=?',
    selectFileById: 'SELECT file_id AS fileId,file_name AS fileName,file_path AS filePath,file_cls AS fileType,rlat_id AS relateId,create_time AS createTime FROM pub_file WHERE (file_id = ? )',
    selectFilesByRelateId : 'SELECT file_id AS fileId,file_name AS fileName,file_path AS filePath,file_cls AS fileType,rlat_id AS relateId,create_time AS createTime FROM pub_file WHERE ( file_cls = ? and rlat_id = ? )',
    setRelateId: 'UPDATE pub_file set rlat_id=? WHERE file_id=? and file_cls=?',
    updateFileByRelateId: 'UPDATE pub_file set rlat_id=? WHERE rlat_id=? and file_cls=?'
};
module.exports = PubFileSSQL;