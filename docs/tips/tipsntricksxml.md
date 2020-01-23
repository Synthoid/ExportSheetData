---
layout: docs
title: XML Tips & Tricks
description: Tips for XML functionality
group: xml
---

XML Tips & Tricks
-----------------
This section covers how to use some more obscure XML functionality in ESD. These tips only apply when targeting the XML export format.

XML Comments
---------------------
If the first cell in a row is the string `!--`, the row will be exported as an XML comment block.

### Example: ###

**Sheet: `Planets`**

Name | Orbit | Description
---- | --------- | -----------
Venus | 0.72 AU | An ethereal puff burning through the sky.
!-- | This is an XML comment! |
Earth | 1 AU | A pale blue dot suspended in a sunbeam.
!-- | Each cell gets... | ...a newline in the block!
Mars | 1.52 AU | A red mote glittering in the dark.
!-- | Hyphens ( - ) are replaced with Underscores ( _ ) |

*Output:*
```
<data>
  <Planets>
    <Venus Orbit="0.72 AU" Description="An ethereal puff burning through the sky." />
    <!--This is an XML comment!-->
    <Earth Orbit="1 AU" Description="A pale blue dot suspended in a sunbeam." />
    <!--Each cell gets...
...a newline in the block!-->
    <Mars Orbit="1.52 AU" Description="A red mote glittering in the dark." />
    <!--Hyphens ( _ ) are replaced with Underscores ( _ ) -->
  </Planets>
</data>
```
