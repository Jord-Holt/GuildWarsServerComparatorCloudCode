
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.job("updateENWorldTableData", function(request, status) {

var updateJob = {
		executions: 0,
		currentWorld: 0,
		data : {
			getWorldData : function(location) {
				Parse.Cloud.httpRequest({
				  method: "GET",
				  url: "https://api.guildwars2.com/v1/world_names.json?lang=" + location,
				  success: function(httpResponse) {
				  	var worlds = httpResponse.data;
				  	for(var i = 0; i < worlds.length; i++) {
						updateJob.model.WorldDataListModel.worldData.push(new updateJob.model.WorldDataModel(worlds[i].id, worlds[i].name));
					}

					updateJob.data.calculateWorldData(updateJob.model.WorldDataListModel.worldData);
				  }
				});

			},

			calculateWorldData : function(worldDataList) {
				var success = 1;
				var failed = 1;
				var maxWorlds = worldDataList.length;

				Parse.Cloud.httpRequest({
				  method: "GET",
				  url: "https://api.guildwars2.com/v1/events.json?world_id=" + worldDataList[updateJob.currentWorld].worldID,
				  success: function(httpResponse) {
				  	var eventStatuses = httpResponse.data.events;

				  	for(var j = 0; j < eventStatuses.length; j++) {
						if(eventStatuses[j].state === "Success") {
							success++;
						}
					
						if(eventStatuses[j].state === "Fail") {
							failed++;
						}
					}

					worldDataList[updateJob.currentWorld].percentages.push(updateJob.utils.getAverageEventSuccess(success,failed));
					worldDataList[updateJob.currentWorld].successPercentage = ((updateJob.utils.getSum(worldDataList[updateJob.currentWorld].percentages)) / worldDataList[updateJob.currentWorld].percentages.length).toFixed(2);

					success = 0;
					failed = 0;
					updateJob.currentWorld++;

					if(updateJob.currentWorld === maxWorlds) {
						updateJob.executions++;
						if(updateJob.executions === 25) {
							updateJob.data.saveWorldData(worldDataList, 0);
						} else {
							updateJob.currentWorld = 0;
							updateJob.data.calculateWorldData(worldDataList);
						}
					} else {
						updateJob.data.calculateWorldData(worldDataList);
					}
				  }
				});
			},
			saveWorldData : function(worldDataList, index) {
				var WorldDataEN = Parse.Object.extend("WorldDataEN");
				var query = new Parse.Query(WorldDataEN);
				Parse.Cloud.useMasterKey();

				if(index === worldDataList.length) {
					status.success("Updates Complete.");
					return false;
				} 

				query.equalTo("world_id", worldDataList[index].worldID);

				query.find({
					success: function(results) {
						if(results.length === 1) {
							results[0].set("success_percentage", worldDataList[index].successPercentage);
							results[0].save();
						} else if(results.length < 1) {
							var worldDataEN = new WorldDataEN();
							worldDataEN.set("world_id", worldDataList[index].worldID);
							worldDataEN.set("world_name", worldDataList[index].worldName);
							worldDataEN.set("success_percentage", worldDataList[index].successPercentage);

							worldDataEN.save(null, {
								success: function(worldData) {
								},
								error: function(worldData, error) {
									console.log("save error: " + error);
								}
							});
						}

						
						updateJob.data.saveWorldData(worldDataList, index + 1);
						
					},
					error: function(error) {
						alert("Error: " + error.code + " " + error.message);
					}
				});
			}
		},
		model : {
			WorldDataListModel : {
				worldData : []
			},

			WorldDataModel : function(worldID, worldName) {
				var self = this;
				self.worldID = worldID;
				self.worldName = worldName;
				self.successPercentage = 0;
				self.percentages = [];
			}
		},
		utils : {
			getSum : function(list) {
				var total = 0;

				for(var i = 0; i < list.length; i++) {
					total += list[i];
				}

				return total;
			},
			getAverageEventSuccess : function(successfulEvents, failedEvents) {
				return successfulEvents / (successfulEvents + failedEvents);
			}
		}
}

updateJob.data.getWorldData("en");

});

Parse.Cloud.job("updateFRWorldTableData", function(request, status) {

var updateJob = {
		executions: 0,
		currentWorld: 0,
		data : {
			getWorldData : function(location) {
				Parse.Cloud.httpRequest({
				  method: "GET",
				  url: "https://api.guildwars2.com/v1/world_names.json?lang=" + location,
				  success: function(httpResponse) {
				  	var worlds = httpResponse.data;
				  	for(var i = 0; i < worlds.length; i++) {
						updateJob.model.WorldDataListModel.worldData.push(new updateJob.model.WorldDataModel(worlds[i].id, worlds[i].name));
					}

					updateJob.data.calculateWorldData(updateJob.model.WorldDataListModel.worldData);
				  }
				});

			},

			calculateWorldData : function(worldDataList) {
				var success = 1;
				var failed = 1;
				var maxWorlds = worldDataList.length;

				Parse.Cloud.httpRequest({
				  method: "GET",
				  url: "https://api.guildwars2.com/v1/events.json?world_id=" + worldDataList[updateJob.currentWorld].worldID,
				  success: function(httpResponse) {
				  	var eventStatuses = httpResponse.data.events;

				  	for(var j = 0; j < eventStatuses.length; j++) {
						if(eventStatuses[j].state === "Success") {
							success++;
						}
					
						if(eventStatuses[j].state === "Fail") {
							failed++;
						}
					}

					worldDataList[updateJob.currentWorld].percentages.push(updateJob.utils.getAverageEventSuccess(success,failed));
					worldDataList[updateJob.currentWorld].successPercentage = ((updateJob.utils.getSum(worldDataList[updateJob.currentWorld].percentages)) / worldDataList[updateJob.currentWorld].percentages.length).toFixed(2);

					success = 0;
					failed = 0;
					updateJob.currentWorld++;

					if(updateJob.currentWorld === maxWorlds) {
						updateJob.executions++;
						if(updateJob.executions === 25) {
							updateJob.data.saveWorldData(worldDataList, 0);
						} else {
							updateJob.currentWorld = 0;
							updateJob.data.calculateWorldData(worldDataList);
						}
					} else {
						updateJob.data.calculateWorldData(worldDataList);
					}
				  }
				});
			},
			saveWorldData : function(worldDataList, index) {
				var WorldDataFR = Parse.Object.extend("WorldDataFR");
				var query = new Parse.Query(WorldDataFR);
				Parse.Cloud.useMasterKey();

				if(index === worldDataList.length) {
					status.success("Updates Complete.");
					return false;
				} 

				query.equalTo("world_id", worldDataList[index].worldID);

				query.find({
					success: function(results) {
						if(results.length === 1) {
							results[0].set("success_percentage", worldDataList[index].successPercentage);
							results[0].save();
						} else if(results.length < 1) {
							var worldDataFR = new WorldDataFR();
							worldDataFR.set("world_id", worldDataList[index].worldID);
							worldDataFR.set("world_name", worldDataList[index].worldName);
							worldDataFR.set("success_percentage", worldDataList[index].successPercentage);

							worldDataFR.save(null, {
								success: function(worldData) {
								},
								error: function(worldData, error) {
									console.log("save error: " + error);
								}
							});
						}

						
						updateJob.data.saveWorldData(worldDataList, index + 1);
						
					},
					error: function(error) {
						alert("Error: " + error.code + " " + error.message);
					}
				});
			}
		},
		model : {
			WorldDataListModel : {
				worldData : []
			},

			WorldDataModel : function(worldID, worldName) {
				var self = this;
				self.worldID = worldID;
				self.worldName = worldName;
				self.successPercentage = 0;
				self.percentages = [];
			}
		},
		utils : {
			getSum : function(list) {
				var total = 0;

				for(var i = 0; i < list.length; i++) {
					total += list[i];
				}

				return total;
			},
			getAverageEventSuccess : function(successfulEvents, failedEvents) {
				return successfulEvents / (successfulEvents + failedEvents);
			}
		}
}

updateJob.data.getWorldData("fr");

});

Parse.Cloud.job("updateDEWorldTableData", function(request, status) {

var updateJob = {
		executions: 0,
		currentWorld: 0,
		data : {
			getWorldData : function(location) {
				Parse.Cloud.httpRequest({
				  method: "GET",
				  url: "https://api.guildwars2.com/v1/world_names.json?lang=" + location,
				  success: function(httpResponse) {
				  	var worlds = httpResponse.data;
				  	for(var i = 0; i < worlds.length; i++) {
						updateJob.model.WorldDataListModel.worldData.push(new updateJob.model.WorldDataModel(worlds[i].id, worlds[i].name));
					}

					updateJob.data.calculateWorldData(updateJob.model.WorldDataListModel.worldData);
				  }
				});

			},

			calculateWorldData : function(worldDataList) {
				var success = 1;
				var failed = 1;
				var maxWorlds = worldDataList.length;

				Parse.Cloud.httpRequest({
				  method: "GET",
				  url: "https://api.guildwars2.com/v1/events.json?world_id=" + worldDataList[updateJob.currentWorld].worldID,
				  success: function(httpResponse) {
				  	var eventStatuses = httpResponse.data.events;

				  	for(var j = 0; j < eventStatuses.length; j++) {
						if(eventStatuses[j].state === "Success") {
							success++;
						}
					
						if(eventStatuses[j].state === "Fail") {
							failed++;
						}
					}

					worldDataList[updateJob.currentWorld].percentages.push(updateJob.utils.getAverageEventSuccess(success,failed));
					worldDataList[updateJob.currentWorld].successPercentage = ((updateJob.utils.getSum(worldDataList[updateJob.currentWorld].percentages)) / worldDataList[updateJob.currentWorld].percentages.length).toFixed(2);

					success = 0;
					failed = 0;
					updateJob.currentWorld++;

					if(updateJob.currentWorld === maxWorlds) {
						updateJob.executions++;
						if(updateJob.executions === 25) {
							updateJob.data.saveWorldData(worldDataList, 0);
						} else {
							updateJob.currentWorld = 0;
							updateJob.data.calculateWorldData(worldDataList);
						}
					} else {
						updateJob.data.calculateWorldData(worldDataList);
					}
				  }
				});
			},
			saveWorldData : function(worldDataList, index) {
				var WorldDataDE = Parse.Object.extend("WorldDataDE");
				var query = new Parse.Query(WorldDataDE);
				Parse.Cloud.useMasterKey();

				if(index === worldDataList.length) {
					status.success("Updates Complete.");
					return false;
				} 

				query.equalTo("world_id", worldDataList[index].worldID);

				query.find({
					success: function(results) {
						if(results.length === 1) {
							results[0].set("success_percentage", worldDataList[index].successPercentage);
							results[0].save();
						} else if(results.length < 1) {
							var worldDataDE = new WorldDataDE();
							worldDataDE.set("world_id", worldDataList[index].worldID);
							worldDataDE.set("world_name", worldDataList[index].worldName);
							worldDataDE.set("success_percentage", worldDataList[index].successPercentage);

							worldDataDE.save(null, {
								success: function(worldData) {
								},
								error: function(worldData, error) {
									console.log("save error: " + error);
								}
							});
						}

						
						updateJob.data.saveWorldData(worldDataList, index + 1);
						
					},
					error: function(error) {
						alert("Error: " + error.code + " " + error.message);
					}
				});
			}
		},
		model : {
			WorldDataListModel : {
				worldData : []
			},

			WorldDataModel : function(worldID, worldName) {
				var self = this;
				self.worldID = worldID;
				self.worldName = worldName;
				self.successPercentage = 0;
				self.percentages = [];
			}
		},
		utils : {
			getSum : function(list) {
				var total = 0;

				for(var i = 0; i < list.length; i++) {
					total += list[i];
				}

				return total;
			},
			getAverageEventSuccess : function(successfulEvents, failedEvents) {
				return successfulEvents / (successfulEvents + failedEvents);
			}
		}
}

updateJob.data.getWorldData("de");

});

Parse.Cloud.job("updateESWorldTableData", function(request, status) {

var updateJob = {
		executions: 0,
		currentWorld: 0,
		data : {
			getWorldData : function(location) {
				Parse.Cloud.httpRequest({
				  method: "GET",
				  url: "https://api.guildwars2.com/v1/world_names.json?lang=" + location,
				  success: function(httpResponse) {
				  	var worlds = httpResponse.data;
				  	for(var i = 0; i < worlds.length; i++) {
						updateJob.model.WorldDataListModel.worldData.push(new updateJob.model.WorldDataModel(worlds[i].id, worlds[i].name));
					}

					updateJob.data.calculateWorldData(updateJob.model.WorldDataListModel.worldData);
				  }
				});

			},

			calculateWorldData : function(worldDataList) {
				var success = 1;
				var failed = 1;
				var maxWorlds = worldDataList.length;

				Parse.Cloud.httpRequest({
				  method: "GET",
				  url: "https://api.guildwars2.com/v1/events.json?world_id=" + worldDataList[updateJob.currentWorld].worldID,
				  success: function(httpResponse) {
				  	var eventStatuses = httpResponse.data.events;

				  	for(var j = 0; j < eventStatuses.length; j++) {
						if(eventStatuses[j].state === "Success") {
							success++;
						}
					
						if(eventStatuses[j].state === "Fail") {
							failed++;
						}
					}

					worldDataList[updateJob.currentWorld].percentages.push(updateJob.utils.getAverageEventSuccess(success,failed));
					worldDataList[updateJob.currentWorld].successPercentage = ((updateJob.utils.getSum(worldDataList[updateJob.currentWorld].percentages)) / worldDataList[updateJob.currentWorld].percentages.length).toFixed(2);

					success = 0;
					failed = 0;
					updateJob.currentWorld++;

					if(updateJob.currentWorld === maxWorlds) {
						updateJob.executions++;
						if(updateJob.executions === 25) {
							updateJob.data.saveWorldData(worldDataList, 0);
						} else {
							updateJob.currentWorld = 0;
							updateJob.data.calculateWorldData(worldDataList);
						}
					} else {
						updateJob.data.calculateWorldData(worldDataList);
					}
				  }
				});
			},
			saveWorldData : function(worldDataList, index) {
				var WorldDataES = Parse.Object.extend("WorldDataES");
				var query = new Parse.Query(WorldDataES);
				Parse.Cloud.useMasterKey();

				if(index === worldDataList.length) {
					status.success("Updates Complete.");
					return false;
				} 

				query.equalTo("world_id", worldDataList[index].worldID);

				query.find({
					success: function(results) {
						if(results.length === 1) {
							results[0].set("success_percentage", worldDataList[index].successPercentage);
							results[0].save();
						} else if(results.length < 1) {
							var worldDataES = new WorldDataES();
							worldDataES.set("world_id", worldDataList[index].worldID);
							worldDataES.set("world_name", worldDataList[index].worldName);
							worldDataES.set("success_percentage", worldDataList[index].successPercentage);

							worldDataES.save(null, {
								success: function(worldData) {
								},
								error: function(worldData, error) {
									console.log("save error: " + error);
								}
							});
						}

						
						updateJob.data.saveWorldData(worldDataList, index + 1);
						
					},
					error: function(error) {
						alert("Error: " + error.code + " " + error.message);
					}
				});
			}
		},
		model : {
			WorldDataListModel : {
				worldData : []
			},

			WorldDataModel : function(worldID, worldName) {
				var self = this;
				self.worldID = worldID;
				self.worldName = worldName;
				self.successPercentage = 0;
				self.percentages = [];
			}
		},
		utils : {
			getSum : function(list) {
				var total = 0;

				for(var i = 0; i < list.length; i++) {
					total += list[i];
				}

				return total;
			},
			getAverageEventSuccess : function(successfulEvents, failedEvents) {
				return successfulEvents / (successfulEvents + failedEvents);
			}
		}
}

updateJob.data.getWorldData("es");

});