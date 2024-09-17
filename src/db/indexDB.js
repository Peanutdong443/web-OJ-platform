export default {
    // indexedDB兼容
    indexedDB: window.indexedDB || window.webkitindexedDB || window.msIndexedDB || window.mozIndexedDB,
    /**
     * 打开数据库
     * 新对象储存空间newStore参数：newStore.name、newStore.key
     * 新增对象存储空间要更改数据库版本
     * @param {数据库名称} dbname 
     * @param {版本} version 
     * @param {数据库} db 
     * @param {配置} newStore 
     * @param {回调函数} callback 
     */
    openDB(dbname, version, callback) {
        let db
        version = version || 1;
        const request = this.indexedDB.open(dbname, version);
        request.onerror = function () {
            console.log('IndexedDB数据库打开错误');
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            if (callback && (typeof callback === 'function')) {
                callback(db);
            }
        };
        // onupgradeneeded，调用创建新的储存空间（只有在数据库未被创建和数据库版本更改的时候才会触发）
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains('tableView')) {
                const objectStore1 = db.createObjectStore('tableView', { keyPath: 'clientId' });
                let datas = ["clientId", "tradeNo"]
                datas.forEach(item => {
                    objectStore1.createIndex(item + '_index', item, {
                        unique: false
                    });
                })
            }
        };
    },
    /**
     * 删除数据库
     * @param {*} dbname 
     * @param {*} callback 
     */
    deleteDb(dbname, callback) {
        const deleteQuest = this.indexedDB.deleteDatabase(dbname);
        deleteQuest.onerror = function () {
            console.log('删除数据库出错');
        };
        deleteQuest.onsuccess = function () {
            if (callback && (typeof callback === 'function')) {
                callback();
            }
        }
    },
    /**
     * 关闭数据库
     * @param {*} dbname 
     */
    closeDB(dbname) {
        dbname.close();
        console.log('数据库已关闭');
    },
    /**
     * 删除数据
     * @param {*} db 
     * @param {*} storename 
     * @param {*} key 
     * @param {*} callback 
     */
    deleteData(db, storename, key, callback) {
        const store = db.transaction(storename, 'readwrite').objectStore(storename);
        const request = store.delete(key);
        request.onsuccess = function () {
            if (callback && (typeof callback === 'function')) {
                callback('删除成功');
            }
        }
        request.onerror = function () {
            if (callback && (typeof callback === 'function')) {
                callback('删除失败');
            }
        }

    },
    /**
     * 清空数据
     * @param {*} db 
     * @param {*} storename 
     * @param {*} callback 
     */
    clearData(db, storename, callback) {
        const store = db.transaction(storename, 'readwrite').objectStore(storename);
        const request = store.clear();
        request.onsuccess = function () {
            if (callback && (typeof callback === 'function')) {
                callback('清空数据成功');
            }
        }
        request.onerror = function () {
            if (callback && (typeof callback === 'function')) {
                callback('清空数据失败');
            }
        }
    },
    /**
     * 添加数据
     * @param {*} db 
     * @param {*} storename 
     * @param {*} obj 
     */
    addData(db, storename, list) {
        console.log(db, storename, list)
        const store = db.transaction(['group'], 'readwrite').objectStore('group');
        const request = store.add({
            id: new Date().getTime(),
            name: '王二',
            age: 12,
            email: 'XXXX@xxx.com',
        });
        request.onsuccess = function () {
            console.log('数据写入成功');
        };
        request.onerror = function () {
            console.log('数据写入失败');
        }
    },
    /**
     * 更新数据
     * @param {*} db 
     * @param {*} storename 
     * @param {*} obj 
     */
    updateData(db, storename, list, callback) {
        const store = db.transaction(storename, 'readwrite').objectStore(storename);
        list.forEach(ls => {
            const request = store.put(ls);
            request.onsuccess = function () {
                if (callback && (typeof callback === 'function')) {
                    callback(true);
                }
                console.log('数据更新成功');
            };
            request.onerror = function () {
                if (callback && (typeof callback === 'function')) {
                    callback(false);
                }
                console.log('数据更新失败');
            }
        })
    },
    /**
     * 根据主键获取数据(数据库的下标)
     * @param {*} db 
     * @param {*} storeName 
     * @param {*} key 
     * @returns 
     */
    getData(db, storeName, key) {
        var objectStore = db.transaction(storeName).objectStore(storeName);
        var request = objectStore.get(key);
        request.onerror = function (event) {
            console.log('事务失败');
        };
        return new Promise((resolve, reject) => {
            request.onsuccess = function (e) {
                resolve(e.target.result)
            }
        })
    },
    /**
     * 根据索引获取数据
     * @param {*} db 
     * @param {*} storeName 
     * @param {*} field 
     * @param {*} val 
     */
    getDataByIndex(db, storeName, field, val) {
        const objectStore = db.transaction(storeName).objectStore(storeName);
        const indexs = objectStore.index(field + '_index');
        const request = indexs.get(val);
        return new Promise((resolve, reject) => {
            request.onsuccess = function (e) {
                resolve(e.target.result)
            }
        })
    },
    /**
     * 获取全部数据
     * @param {*} db 
     * @param {*} storeName 
     * @returns 
     */
    getAllData(db, storeName) {
        const objectStore = db.transaction(storeName).objectStore(storeName);
        const request = objectStore.openCursor();

        let data = [];
        return new Promise((resolve, reject) => {
            request.onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                    data.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(data)
                }
            }
        })
    },
    /**
     * 遍历全部数据，判断数据是否已存在于数据库
     * @param {*} allDbData
     * @param {*} list
     * @returns 
     */
    readAllData(allDbData, list) {
        let flagIndex
        allDbData.then(res => {
            flagIndex = res.findIndex(val => {
                return (val.menuid == list[0].menuid)
            })
        })
        return flagIndex
    },
    //  查询数据方法
    getDatabyId(db, storeName, filId, val) {
        const objectStore = db.transaction(storeName).objectStore(storeName);
        const indexs = objectStore.index(filId + '_index');
        const request = indexs.openCursor(IDBKeyRange.only(val));//精确查询，查询内容相等的数据
        // const startTime = new Date("2024-03-21T00:00:00Z").toISOString();
        // const endTime = new Date("2024-03-26T00:00:00Z").toISOString();
        // const range = IDBKeyRange.bound(this.utcDate(val), this.utcDate(vals) );//后两位参数，true代表不包含val 反之包含 >= val 和 > val的区别
        // const request = indexs.openCursor(range);
        let data = [];
        return new Promise((resolve, reject) => {
            request.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    data.push(cursor.value)
                    cursor.continue(); // 继续查找其他记录
                } else {
                    resolve(data)
                }

            }
        })
    },
    utcDate(val) {
        const date = new Date(val);
        let utcDates = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        console.log(new Date(utcDates).toISOString())
        return new Date(utcDates).toISOString()
    },
}

