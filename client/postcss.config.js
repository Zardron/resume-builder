import discardDuplicates from 'postcss-discard-duplicates';
import normalizeCharset from 'postcss-normalize-charset';

export default {
  plugins: [
    // Normalize charset - ensures @charset is at the top and removes duplicates
    normalizeCharset(),
    discardDuplicates(),
  ],
};

