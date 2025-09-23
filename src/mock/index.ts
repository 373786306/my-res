import type{ MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/statistics/industry',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [
          {
            "industryId": "1565962315699400705",
            "industryName": "行业标准1",
            "industryTableName": "lcat_wj",
            "industryDescription": "1",
            "industryStatus": 2,
            "keys": null,
            "list": null,
            "count": 200
        },
        {
            "industryId": "1565962264742801409",
            "industryName": "行业标准2",
            "industryTableName": "lcat_cb",
            "industryDescription": "2",
            "industryStatus": 2,
            "keys": null,
            "list": null,
            "count": 122
        },
        {
            "industryId": "1565962460574855169",
            "industryName": "行业标准3",
            "industryTableName": "lcat_sj",
            "industryDescription": "3",
            "industryStatus": 2,
            "keys": null,
            "list": null,
            "count": 345
        },
        {
            "industryId": "1565962362927263745",
            "industryName": "行业标准4",
            "industryTableName": "lcat_hb",
            "industryDescription": "4",
            "industryStatus": 2,
            "keys": null,
            "list": null,
            "count": 551
        },
        {
            "industryId": "1565962422196973570",
            "industryName": "行业标准5",
            "industryTableName": "lcat_gjb",
            "industryDescription": "4",
            "industryStatus": 2,
            "keys": null,
            "list": null,
            "count": 240
        },
        {
            "industryId": "1669234506804576258",
            "industryName": "行业标准6",
            "industryTableName": "lcat_gw",
            "industryDescription": "4",
            "industryStatus": 2,
            "keys": null,
            "list": null,
            "count": 210
        }
        ]
      }
    }
  },
  {
    url: '/api/statistics/standardStatus',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [
          {
            "total_count": 105,
            "std_sta_value": "现行"
        },
        {
            "total_count": 50,
            "std_sta_value": "废止"
        },
        {
            "total_count": 37,
            "std_sta_value": "修订中"
        },
        {
            "total_count": 100,
            "std_sta_value": "草案"
        }
        ]
      }
    }
  },
  {
    url: '/api/statistics/category',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [
          {
            "name": "工业品",
            "value": 7
        },
        {
            "name": "半成品",
            "value": 120
        },
        {
            "name": "服务产品",
            "value": 10
        },
        {
            "name": "数字产品",
            "value": 20
        },
        {
            "name": "文化产品",
            "value": 1
        },
        {
            "name": "环保产品",
            "value": 1
        }
        ]
      }
    }
  },
  {
    url: '/api/statistics/productStatistics',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: [
          {
            "name": "产品1",
            "value": 100
        },
        {
            "name": "产品2",
            "value": 52
        },
        {
            "name": "产品3",
            "value": 18
        }
        ]
      }
    }
  }
] as MockMethod[]