const avatarStyles = [
  'adventurer-neutral',
  'big-smile',
  'croodles',
  'fun-emoji',
  'pixel-art',
  'thumbs',
]

export const generateAvatarUrl = (rawSeed = '') => {
  const fallbackSeed = 'resume-user'
  const seed = rawSeed && rawSeed.trim() ? rawSeed.trim() : fallbackSeed

  const styleIndex =
    seed.split('').reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0) %
    avatarStyles.length

  const style = avatarStyles[styleIndex]

  return `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(seed)}&size=200`
}


