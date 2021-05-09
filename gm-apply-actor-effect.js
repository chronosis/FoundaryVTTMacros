/**
 * Copyright © 2021 Chronosis / Jay Reardon
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 * files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, 
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * ------------------------------------------------------------------------------------------------------------------------------
 *
 * This macro was designed to help the GM track who has a Twilight Cleric's Vigilant Blessing for DND5e
 * However it is generic and can be edited to track any skill/skill type.
 *
 * This macro will apply a Passive Effect to the first targetted actor token. That Passive Effect will updated the specific
 * effect flag indicated to that actor. In this version the flag set is the DND5e Advantage on Intitiative Rolls effect
 * that corresponds to a Twilight Cleric's Vigilant Blessing class feature.
 *
 * The macro checks for exclusivity, that is, that only one character can be granted that effect at a time. Before applyng 
 * the effect it will remove the effect from any other actor who previously had that actor's Vigilant Blessing (or whatever effect
 * was configured).
 *
 * The macros also checks that the actor using the ability has that ability and will display a warning message if it does not.
 *
 * To use this, you must be logged in as the GM, and must perform the following steps:
 *   1. Target the token receiving the effect
 *   2. Select the token for the character using the ability
 *   3. Activate the Macro
 */

// Change these values as you would like to alter the macro for specific skill/class feature De/Buffs
const skillName = 'Vigilant Blessing';
const skillType = 'feat';
const flagName = 'flags.dnd5e.initiativeAdv';  // See https://gitlab.com/foundrynet/dnd5e/-/blob/master/module/config.js#L740
const skillIconPath = 'icons/svg/angel.svg';
const skillIconTint = '#6723f5';

// Do not alter these
const bgnMsg = `<i><b>${skillName}</b></i> was granted to:<br/>`;
const endMsg = `<i><b>${skillName}</b></i> was removed from:<br/>`;
const macroActor = token?.actor;
const target = [...game.user.targets][0];

const skillEffectDetails = {
  label: skillName,
  changes: [
    {
      key: flagName,
      value: 1,
      mode: 2,
      priority: 20,
    },
  ],
  icon: skillIconPath,
  tint: skillIconTint,
  origin: macroActor?.uuid ?? '',
};

// Identify Token
if (!macroActor) {
  ui.notifications.warn('Please select an actor token and a target first.');
} else {
  let alreadyBuffed = false;
  let outputMessage = '';
  const skillFeature = macroActor.data.items.find((item) => (item.name === skillName && item.type === skillType));

  if (!skillFeature) {
    ui.notifications.warn(`Please select an actor who has the ${skillName} ability/feature`);
  } else if (!target) {
    ui.notifications.warn('Please select a target for the active token.');
  } else {
    // Find existing skill/ability granted from this actor and remove
    const removedActorNames = [];
    const sceneActors = [...game.actors];
    sceneActors.forEach((act) => {
      const skillEffect = act.effects.find((eff) => (eff.data.label === skillName &&
        eff.data.origin ===  macroActor.uuid));
      if (skillEffect) {
        if (act.name !== target.actor.name) {
          act.deleteEmbeddedEntity('ActiveEffect', skillEffect.id);
          removedActorNames.push(act.name);
        } else {
          alreadyBuffed = true;
        }
      }
    });

    if (removedActorNames.length > 0) {
      outputMessage += `${endMsg}<ul>`;
      removedActorNames.forEach((name) => {
        outputMessage += `<li>${name}</li>`;
      });
      outputMessage += `</ul>`;
    }

    // Create new Skill/Ability on targeted Actor
    if (!alreadyBuffed) {
      outputMessage += `${bgnMsg}<ul><li>${target.actor.name}</li></ul>`;
      target.actor.createEmbeddedEntity('ActiveEffect', skillEffectDetails);
    } else {
      ui.notifications.warn(`That target already has ${macroActor.name}'s ${skillName}`);
    }

    if (outputMessage !== '') {
      const chatData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        content: outputMessage,
      };
      ChatMessage.create(chatData, {});
    }
  }
}