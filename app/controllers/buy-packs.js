import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Controller.extend({
  currentUser: service(),
  strikersContracts: service(),

  isOwedFreeReferralPack: alias('model.isOwedFreeReferralPack'),
  standardWhitelistAllocation: alias('model.standardWhitelistAllocation'),
  premiumWhitelistAllocation: alias('model.premiumWhitelistAllocation'),

  actions: {
    buyPack(sale) {
      if (!sale) { return; }
      this.get('buyPackTask').perform(sale);
    },

    claimReferralPack() {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const currentUser = this.get('currentUser');
      const from = currentUser.get('address');
      contract.claimFreeReferralPack().send({ from })
      .on('transactionHash', txnHash => {
        const type = 'claim_referral_pack';
        const activity = { txnHash, type };
        currentUser.addActivity(activity).then(activityId => {
          this.transitionToRoute('activity.show', activityId);
        });
      });
    },

    claimWhitelistPack(premium) {
      const contract = this.get('strikersContracts.StrikersPackSale.methods');
      const currentUser = this.get('currentUser');
      const from = currentUser.get('address');
      contract.claimWhitelistPack(premium).send({ from })
      .on('transactionHash', txnHash => {
        const type = 'claim_whitelist_pack';
        const activity = { premium, txnHash, type };
        currentUser.addActivity(activity).then(activityId => {
          this.transitionToRoute('activity.show', activityId);
        });
      });
    }
  },

  buyPackTask: task(function * (sale) {
    const contract = this.get('strikersContracts.StrikersPackSale.methods');
    const currentUser = this.get('currentUser');
    const from = currentUser.get('address');
    const premium = !sale.get('isStandard');
    const referrer = currentUser.get('user.referrer.id');
    const value = sale.get('packPrice');

    let shouldAttributeReferral = false;
    if (referrer) {
      const packsBought = yield contract.packsBought(from).call();
      shouldAttributeReferral = parseInt(packsBought) === 0;
    }

    const contractFunction = shouldAttributeReferral ? contract.buyFirstPackFromReferral(referrer, premium) : contract.buyPackWithETH(premium);
    contractFunction.send({ from, value })
    .on('transactionHash', txnHash => {
      const type = 'buy_pack';
      const activity = { premium, txnHash, type };
      currentUser.addActivity(activity).then(activityId => {
        this.transitionToRoute('activity.show', activityId);
      });
    });
  }).drop(),

  alertText: computed('isOwedFreeReferralPack', 'standardWhitelistAllocation', 'premiumWhitelistAllocation', function() {
    let str = '';

    let standardWhitelistAllocation = parseInt(this.get('standardWhitelistAllocation'));
    if (this.get('isOwedFreeReferralPack')) {
      standardWhitelistAllocation++;
    }

    if (standardWhitelistAllocation > 0) {
      str += `${standardWhitelistAllocation} Standard Pack`;
    }
    if (standardWhitelistAllocation > 1) {
      str += 's';
    }

    const premiumWhitelistAllocation = parseInt(this.get('premiumWhitelistAllocation'));
    if (premiumWhitelistAllocation > 0) {
      str = str.length > 0 ? `${str} and ` : str;
      str += `${premiumWhitelistAllocation} Premium Pack`;
    }
    if (premiumWhitelistAllocation > 1) {
      str += 's';
    }

    return str;
  }),

  shouldShowAlert: computed('isOwedFreeReferralPack', 'standardWhitelistAllocation', 'premiumWhitelistAllocation', function() {
    const isOwedFreeReferralPack = this.get('isOwedFreeReferralPack');
    const hasStandardWhitelistAllocation = this.get('standardWhitelistAllocation') > 0;
    const hasPremiumWhitelistAllocation = this.get('premiumWhitelistAllocation') > 0;
    return isOwedFreeReferralPack || hasStandardWhitelistAllocation || hasPremiumWhitelistAllocation;
  })
});
