export default {
  "entry": "./src/entries/index/index.js",
  "outputPath": "./dist/index",
  "publicPath" : "/resources/zsb/index/",
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime",
        "transform-decorators-legacy",
        ["import", { "libraryName": "antd", "style": "css" }]
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        "transform-decorators-legacy",
        ["import", { "libraryName": "antd", "style": "css" }]
      ]
    }
  },
  "hash": false,
  "cssModulesExclude": [
  		"./src/pages/scrm/microGame/MicroGame.css",
  		"./src/pages/scrm/microLeaflet/MicroLeaflet.css",
  		"./src/pages/scrm/microActivity-template/labour_template/labour_template.css",
			"./src/pages/scrm/microActivity-template/newYear_template/newYear_template.css",
			"./src/pages/scrm/microActivity-template/yuanxiao_template/yuanxiao_template.css",
			"./src/pages/scrm/microActivity-template/spring_template/spring_template.css",
			"./src/pages/scrm/microActivity-template/doanngo_template/doanngo_template.css",
			"./src/pages/scrm/microLeaflet-template/english_template/english_template.css",
			"./src/pages/scrm/microLeaflet-template/organCommon_template/organCommon_template.css",
			"./src/pages/scrm/microLeaflet-template/organGeneral_template/organGeneral_template.css"
  ],
  "proxy": {
      "/" : {
        "target": "http://192.168.1.134:9091",
      },
      // "/zsb-web": {
      //   "target": "http://192.168.1.53",
      //   "pathRewrite": { "^/zsb-web" : "/zsb-web" }
      // },
      // "/zsb-web-2": {
      //   "target": {
      //     "host": "192.168.1.235",
      //     "protocol": "http:",
      //     "port": 9091
      //   },
      //   "pathRewrite": { "^/zsb-web" : "/zsb-web" }
      // }
  	}
}
