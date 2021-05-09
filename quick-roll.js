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
 * This macro was designed to make it easy to make quick repeated rolls of a speciific type and mode
 * For example, in the default configuration below a Blind GM rolls for Perception in DND5e. However, 
 * it can be easily altered for any systems specific roll types.
 *
 */

const skillAbbv = 'prc';                          // See https://gitlab.com/foundrynet/dnd5e/-/blob/master/module/config.js#L451
const skillName = 'Perception';
const skill = actor.data.data.skills[skillAbbv];
const rollFormula = '1d20'                        // Can be 1d20r1=1 2d20kh 2d20kl etc.
const rollMode = 'blindroll';
const mod = skill.mod;
const prof = skill.prof;
const bonus = skill.bonus;
const roll= new Roll(`${rollFormula} + @mod + @bonus + @prof`, {mod, bonus, prof});

const msg = {
  speaker: ChatMessage.getSpeaker({ actor: this.actor }),
  flavor: `${skillName} Skill Check`
};

const mode = { rollMode };
roll.toMessage(msg, mode);