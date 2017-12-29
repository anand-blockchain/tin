'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Watched transaction processor function.
 * @param {tin.WatchedTransaction} tx The watched transaction instance.
 * @transaction
 */
function watchVideoClip(tx) {
  	tx.newsClip.producer.points = tx.newsClip.producer.points + 10;
    tx.consumer.reputation = tx.consumer.reputation + 100;
  
  	if(tx.newsClip.published == false){
      // Emit an event for the modified asset.
      var event = getFactory().newEvent('tin', 'ErrorEvent');
      event.eventName = tx.newsClip.clipId+" cannot be viewed, it is not published yet."
      emit(event);
      return null
    }else{
      // Get the asset registry for the asset.
      return getAssetRegistry('tin.NewsClip')
          .then(function (assetRegistry) {

              // Update the asset in the asset registry.
              return assetRegistry.update(tx.newsClip);

          })
          .then(function () {
              return getParticipantRegistry('tin.User');
          })
          .then(function (participantRegistry) {

              // Update the asset in the asset registry.
              return participantRegistry.update(tx.newsClip.producer);
          })
          .then(function () {
              return getParticipantRegistry('tin.User');
          })
          .then(function (participantRegistry) {

              // Update the asset in the asset registry.
              return participantRegistry.update(tx.consumer);
          })
          .then(function () {

              // Emit an event for the modified asset.
              var event = getFactory().newEvent('tin', 'WatchedEvent');
              event.eventName = tx.consumer.firstName+" watched clip: "+tx.newsClip.clipId
              event.newsClip = tx.newsClip;
              event.producer = tx.newsClip.producer;
              event.consumer = tx.consumer;
              emit(event);
          });
    }
}

/**
 * Published transaction processor function.
 * @param {tin.PublishedTransaction} tx The published transaction instance.
 * @transaction
 */
function publishVideoClip(tx) {
  	tx.newsClip.producer.reputation = tx.newsClip.producer.reputation + 100;
    tx.newsClip.published = true;
  
  	if(tx.newsClip.producer.userId != tx.producer.userId){
      // Emit an event for the modified asset.
      var event = getFactory().newEvent('tin', 'ErrorEvent');
      event.eventName = tx.newsClip.clipId+" can only be published by the producer: "+tx.producer.userId
      emit(event);
      return null
    }else{
      // Get the asset registry for the asset.
      return getAssetRegistry('tin.NewsClip')
          .then(function (assetRegistry) {

              // Update the asset in the asset registry.
              return assetRegistry.update(tx.newsClip);

          })
          .then(function () {
              return getParticipantRegistry('tin.User');
          })
          .then(function (participantRegistry) {

              // Update the asset in the asset registry.
              return participantRegistry.update(tx.newsClip.producer);
          })
          .then(function () {

              // Emit an event for the modified asset.
              var event = getFactory().newEvent('tin', 'PublishedEvent');
              event.eventName = tx.producer.firstName+" published clip: "+tx.newsClip.clipId
              event.newsClip = tx.newsClip;
              event.producer = tx.newsClip.producer;
              emit(event);
          });
    }
}