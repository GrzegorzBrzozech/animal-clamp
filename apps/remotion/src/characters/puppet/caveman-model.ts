// puppet-model.js — exported from Puppet Studio 2026-09-28
export const model = {
  "viewBox": "-220 -80 700 640",
  "colors": {
    "ink": "#3b3a37",
    "skin": "#e9e2d2",
    "hair": "#38372e",
    "Fur": "#8f8676",
    "wood": "#8a5a34",
    "stone": "#6b6b6b",
    "root": "#81086b",
    "greens": "#47760f"
  },
  "bones": [
    {
      "id": "root",
      "parent": null,
      "x": 4,
      "y": 276,
      "angle": 0,
      "len": 0,
      "z": 0,
      "merge": false,
      "drawAs": "limb",
      "width": 28,
      "layer": "back",
      "icon": "🫜",
      "mergeGroup": null
    },
    {
      "id": "head",
      "parent": "root",
      "x": 2,
      "y": -215,
      "angle": 0,
      "len": 0,
      "z": 20,
      "merge": true,
      "drawAs": "limb",
      "width": 22,
      "mergeGroup": "head"
    },
    {
      "id": "armUpperL",
      "parent": "root",
      "x": -83,
      "y": -143,
      "angle": 140.5,
      "len": 80,
      "drawAs": "limb",
      "width": 52,
      "z": 12,
      "endCap": false,
      "merge": true,
      "layer": null,
      "mergeGroup": "body"
    },
    {
      "id": "armLowerL",
      "parent": "armUpperL",
      "x": 2,
      "y": -2,
      "angle": -51.7,
      "len": 78,
      "drawAs": "limb",
      "width": 45,
      "z": 14,
      "endCap": true,
      "mergeGroup": "armL"
    },
    {
      "id": "armUpperR",
      "parent": "root",
      "x": 90,
      "y": -139,
      "angle": 44.5,
      "len": 80,
      "drawAs": "limb",
      "width": 52,
      "z": 10,
      "endCap": false,
      "mergeGroup": "body"
    },
    {
      "id": "armLowerR",
      "parent": "armUpperR",
      "x": 6,
      "y": 0,
      "angle": 42.1,
      "len": 77,
      "drawAs": "limb",
      "width": 45,
      "z": 9,
      "endCap": true,
      "mergeGroup": "armR",
      "merge": true
    },
    {
      "id": "legUpperL",
      "parent": "root",
      "x": -41,
      "y": 5,
      "angle": 100.1,
      "len": 92,
      "drawAs": "limb",
      "width": 50,
      "z": 2,
      "endCap": false,
      "mergeGroup": "body"
    },
    {
      "id": "legLowerL",
      "parent": "legUpperL",
      "x": 0,
      "y": -1,
      "angle": -7.5,
      "len": 20,
      "drawAs": "limb",
      "width": 50,
      "z": 2,
      "endCap": false,
      "mergeGroup": "body"
    },
    {
      "id": "legUpperR",
      "parent": "root",
      "x": 38,
      "y": 2,
      "angle": 75.2,
      "len": 92,
      "drawAs": "limb",
      "width": 50,
      "z": 2,
      "endCap": false,
      "mergeGroup": "body"
    },
    {
      "id": "legLowerR",
      "parent": "legUpperR",
      "x": 1,
      "y": 1,
      "angle": 10.6,
      "len": 22,
      "drawAs": "limb",
      "width": 51,
      "z": 2,
      "endCap": false,
      "mergeGroup": "body"
    },
    {
      "id": "boneox6op",
      "parent": "root",
      "x": 2,
      "y": -181,
      "angle": 89.1,
      "len": 164,
      "drawAs": null,
      "width": 28,
      "z": 8,
      "label": "Torso",
      "icon": "🩻",
      "mergeGroup": "body"
    },
    {
      "id": "bone35bhe",
      "parent": "armLowerL",
      "x": 1,
      "y": 0,
      "angle": -87.7,
      "len": 374,
      "drawAs": null,
      "width": 28,
      "z": 8,
      "label": "Спис.",
      "icon": "🦯"
    },
    {
      "id": "bonecxzjy",
      "parent": "armLowerL",
      "x": -30,
      "y": 27,
      "angle": -33,
      "len": 180,
      "drawAs": null,
      "width": 24,
      "z": 10,
      "endCap": false,
      "label": "stick",
      "icon": "🪾",
      "mergeGroup": "stick"
    },
    {
      "id": "bone3im6l",
      "parent": "armLowerR",
      "x": -11,
      "y": 2,
      "angle": 14.6,
      "len": 100,
      "drawAs": null,
      "width": 28,
      "z": 8,
      "label": "Beet",
      "icon": "🫜"
    }
  ],
  "shapes": [
    {
      "id": "torso",
      "bone": "boneox6op",
      "kind": "poly",
      "z": 5,
      "fill": "skin",
      "pts": [
        [
          21,
          90
        ],
        [
          170,
          72
        ],
        [
          165,
          -67
        ],
        [
          25,
          -90
        ],
        [
          -5,
          -58
        ],
        [
          -50,
          -40
        ],
        [
          -53,
          35
        ],
        [
          -6,
          55
        ]
      ],
      "mergeGroup": "body"
    },
    {
      "id": "cloth",
      "bone": "root",
      "kind": "poly",
      "z": 6,
      "fill": "Fur",
      "pts": [
        [
          11,
          -72
        ],
        [
          61,
          -192
        ],
        [
          76,
          -23
        ],
        [
          93,
          84
        ],
        [
          66,
          74
        ],
        [
          21,
          108
        ],
        [
          -20,
          65
        ],
        [
          -39,
          79
        ],
        [
          -59,
          57
        ],
        [
          -94,
          86
        ],
        [
          -70,
          -15
        ],
        [
          -15,
          -33
        ]
      ],
      "hidden": false,
      "merge": false
    },
    {
      "id": "shapena72s",
      "bone": "legLowerL",
      "kind": "poly",
      "z": 10,
      "fill": "skin",
      "pts": [
        [
          36,
          -24
        ],
        [
          25,
          -22
        ],
        [
          26,
          17
        ],
        [
          37,
          43
        ],
        [
          48,
          49
        ],
        [
          49,
          38
        ],
        [
          55,
          30
        ],
        [
          53,
          16
        ],
        [
          53,
          1
        ],
        [
          41,
          -13
        ]
      ],
      "label": "FootL",
      "icon": "👟"
    },
    {
      "id": "shapeovocp",
      "bone": "legLowerR",
      "kind": "poly",
      "z": 10,
      "fill": "skin",
      "pts": [
        [
          68,
          -10
        ],
        [
          62,
          -23
        ],
        [
          65,
          -32
        ],
        [
          58,
          -36
        ],
        [
          57,
          -49
        ],
        [
          43,
          -38
        ],
        [
          32,
          -15
        ],
        [
          30,
          25
        ],
        [
          47,
          32
        ],
        [
          52,
          14
        ],
        [
          58,
          1
        ]
      ],
      "label": "FootR",
      "icon": "👟"
    },
    {
      "id": "headbox",
      "bone": "head",
      "kind": "poly",
      "z": 20,
      "fill": "skin",
      "pts": [
        [
          33,
          -35
        ],
        [
          47,
          60
        ],
        [
          27,
          69
        ],
        [
          7,
          71
        ],
        [
          -45,
          61
        ],
        [
          -28,
          -38
        ]
      ],
      "merge": true,
      "hidden": false,
      "mergeGroup": "head"
    },
    {
      "id": "hair",
      "bone": "head",
      "kind": "poly",
      "z": 21,
      "fill": "hair",
      "pts": [
        [
          -19,
          -32
        ],
        [
          -29,
          -34
        ],
        [
          -54,
          7
        ],
        [
          -35,
          -34
        ],
        [
          -58,
          -18
        ],
        [
          -32,
          -42
        ],
        [
          -37,
          -44
        ],
        [
          -54,
          -52
        ],
        [
          -21,
          -51
        ],
        [
          -10,
          -62
        ],
        [
          -4,
          -52
        ],
        [
          12,
          -66
        ],
        [
          18,
          -51
        ],
        [
          32,
          -52
        ],
        [
          48,
          -55
        ],
        [
          41,
          -47
        ],
        [
          48,
          -26
        ],
        [
          34,
          -37
        ],
        [
          33,
          -20
        ],
        [
          15,
          -35
        ],
        [
          -9,
          -38
        ],
        [
          -23,
          -10
        ]
      ],
      "merge": false
    },
    {
      "id": "earL",
      "bone": "head",
      "kind": "circle",
      "z": 19,
      "fill": "skin",
      "cx": -39,
      "cy": 1,
      "r": 11,
      "mergeGroup": "head"
    },
    {
      "id": "earR",
      "bone": "head",
      "kind": "circle",
      "z": 19,
      "fill": "skin",
      "cx": 44,
      "cy": 1,
      "r": 11,
      "mergeGroup": "head",
      "merge": true
    },
    {
      "id": "browL",
      "bone": "head",
      "kind": "poly",
      "z": 22,
      "fill": "ink",
      "stroke": false,
      "pts": [
        [
          -25,
          -4
        ],
        [
          0,
          0
        ],
        [
          -2,
          5
        ],
        [
          -25,
          1
        ]
      ],
      "merge": false,
      "layer": null
    },
    {
      "id": "browR",
      "bone": "head",
      "kind": "poly",
      "z": 22,
      "fill": "ink",
      "stroke": false,
      "pts": [
        [
          40,
          -3
        ],
        [
          14,
          0
        ],
        [
          14,
          4
        ],
        [
          40,
          3
        ]
      ]
    },
    {
      "id": "eyeL",
      "bone": "head",
      "kind": "circle",
      "z": 22,
      "fill": "ink",
      "stroke": false,
      "cx": -12,
      "cy": 4,
      "r": 5,
      "merge": false
    },
    {
      "id": "eyeR",
      "bone": "head",
      "kind": "circle",
      "z": 22,
      "fill": "ink",
      "stroke": false,
      "cx": 26,
      "cy": 5,
      "r": 5
    },
    {
      "id": "nose",
      "bone": "head",
      "kind": "poly",
      "z": 22,
      "fill": "skin",
      "pts": [
        [
          5,
          1
        ],
        [
          -1,
          39
        ],
        [
          21,
          39
        ],
        [
          9,
          1
        ]
      ],
      "merge": false
    },
    {
      "id": "mouth",
      "bone": "head",
      "kind": "poly",
      "z": 22,
      "fill": "ink",
      "stroke": false,
      "pts": [
        [
          -7,
          47
        ],
        [
          29,
          47
        ],
        [
          29,
          50
        ],
        [
          -7,
          50
        ]
      ]
    },
    {
      "id": "shapehpyuy",
      "bone": "armLowerL",
      "z": 11,
      "fill": "skin",
      "kind": "circle",
      "cx": 85,
      "cy": -23,
      "r": 8,
      "merge": true,
      "label": "ThumbR",
      "icon": "👍"
    },
    {
      "id": "shape5a485",
      "bone": "armLowerR",
      "z": 10,
      "fill": "skin",
      "kind": "circle",
      "cx": 84,
      "cy": 23,
      "r": 8,
      "label": "ThumbL",
      "icon": "👍",
      "mergeGroup": "armR"
    },
    {
      "id": "shape9k3hj",
      "bone": "armLowerR",
      "z": 10,
      "fill": "skin",
      "kind": "circle",
      "cx": 103,
      "cy": 3,
      "r": 8,
      "icon": "👆",
      "label": "Pointer",
      "mergeGroup": "armR"
    },
    {
      "id": "shapepy1qf",
      "bone": "armLowerR",
      "z": 10,
      "fill": "skin",
      "kind": "circle",
      "cx": 96,
      "cy": -17,
      "r": 8,
      "label": "PinkyL",
      "icon": "🤙",
      "mergeGroup": "armR"
    },
    {
      "id": "shapeugpyx",
      "bone": "armLowerL",
      "z": 11,
      "fill": "skin",
      "kind": "circle",
      "cx": 98,
      "cy": -9,
      "r": 8,
      "label": "PointerR",
      "icon": "👆"
    },
    {
      "id": "shape7vczj",
      "bone": "armLowerL",
      "z": 11,
      "fill": "skin",
      "kind": "circle",
      "cx": 95,
      "cy": 15,
      "r": 8,
      "label": "PinkeR",
      "icon": "🤙",
      "merge": true,
      "mergeGroup": null
    },
    {
      "id": "shapet7k8o",
      "bone": "root",
      "z": 10,
      "fill": "ink",
      "kind": "circle",
      "cx": 39,
      "cy": -32,
      "r": 9,
      "label": "Dot-1",
      "icon": "⚫️",
      "groupWith": "cloth"
    },
    {
      "id": "shapek5gxj",
      "bone": "root",
      "z": 10,
      "fill": "ink",
      "kind": "circle",
      "cx": -64,
      "cy": 40,
      "r": 7,
      "label": "Dot-2",
      "icon": "⚫️",
      "groupWith": "cloth"
    },
    {
      "id": "shapecevl7",
      "bone": "root",
      "z": 10,
      "fill": "ink",
      "kind": "circle",
      "cx": -18,
      "cy": -12,
      "r": 5,
      "label": "Dot-3",
      "icon": "⚫️",
      "groupWith": "cloth"
    },
    {
      "id": "shapelnmm6",
      "bone": "root",
      "z": 10,
      "fill": "ink",
      "kind": "circle",
      "cx": 37,
      "cy": 35,
      "r": 10,
      "label": "Dot-4",
      "icon": "⚫️",
      "groupWith": "cloth"
    },
    {
      "id": "shapecy80l",
      "bone": "boneox6op",
      "kind": "poly",
      "z": 5,
      "fill": "hair",
      "pts": [
        [
          76,
          5
        ],
        [
          75,
          -4
        ],
        [
          121,
          1
        ],
        [
          119,
          -2
        ]
      ],
      "label": "chest-divider",
      "icon": "⎸",
      "groupWith": "torso"
    },
    {
      "id": "shapeiigx0",
      "bone": "boneox6op",
      "z": 5,
      "fill": "Fur",
      "kind": "circle",
      "cx": 102,
      "cy": 49,
      "r": 4,
      "merge": false,
      "label": "Nipple",
      "groupWith": "torso"
    },
    {
      "id": "shapefxx9u",
      "bone": "boneox6op",
      "kind": "poly",
      "z": 5,
      "fill": "hair",
      "pts": [
        [
          120,
          63
        ],
        [
          123,
          19
        ],
        [
          123,
          16
        ]
      ],
      "hidden": false,
      "merge": false,
      "label": "underbrest",
      "icon": "━",
      "groupWith": "torso"
    },
    {
      "id": "shaped71yx",
      "bone": "root",
      "z": 10,
      "fill": "ink",
      "kind": "circle",
      "cx": 48,
      "cy": -118,
      "r": 3,
      "label": "Dot-5",
      "icon": "⚫️",
      "groupWith": "cloth"
    },
    {
      "id": "shapegtnz7",
      "bone": "root",
      "z": 10,
      "fill": "ink",
      "kind": "circle",
      "cx": 76,
      "cy": 64,
      "r": 4,
      "label": "Dot-6",
      "icon": "⚫️",
      "groupWith": "cloth"
    },
    {
      "id": "shapesebg7",
      "bone": "root",
      "z": 10,
      "fill": "ink",
      "kind": "circle",
      "cx": -9,
      "cy": 54,
      "r": 8,
      "label": "Dot-7",
      "icon": "⚫️",
      "groupWith": "cloth"
    },
    {
      "id": "shapeuhrve",
      "bone": "head",
      "z": 22,
      "fill": "ink",
      "kind": "poly",
      "pts": [
        [
          -35,
          52
        ],
        [
          -36,
          58
        ],
        [
          -44,
          70
        ]
      ],
      "merge": false,
      "layer": "front",
      "label": "beard-1"
    },
    {
      "id": "shapelw4wc",
      "bone": "head",
      "z": 22,
      "fill": "ink",
      "kind": "poly",
      "pts": [
        [
          -18,
          57
        ],
        [
          -19,
          63
        ],
        [
          -20,
          73
        ]
      ],
      "merge": false,
      "layer": "front",
      "label": "beard-2"
    },
    {
      "id": "shapej8ljx",
      "bone": "head",
      "z": 22,
      "fill": "ink",
      "kind": "poly",
      "pts": [
        [
          36,
          53
        ],
        [
          39,
          58
        ],
        [
          44,
          70
        ]
      ],
      "merge": false,
      "layer": "front",
      "label": "beard-3"
    },
    {
      "id": "mouthOpen",
      "bone": "head",
      "kind": "poly",
      "z": 22,
      "fill": "ink",
      "stroke": false,
      "hidden": true,
      "label": "Mouth (open)",
      "pts": [
        [
          -6,
          45
        ],
        [
          10,
          44
        ],
        [
          26,
          45
        ],
        [
          29,
          49
        ],
        [
          22,
          54
        ],
        [
          8,
          55
        ],
        [
          -4,
          54
        ],
        [
          -7,
          49
        ]
      ]
    },
    {
      "id": "shapexwqak",
      "bone": "head",
      "z": 22,
      "fill": "ink",
      "kind": "poly",
      "pts": [
        [
          29,
          56
        ],
        [
          30,
          60
        ],
        [
          34,
          78
        ]
      ],
      "merge": false,
      "layer": "front",
      "hidden": false,
      "label": "beard-4"
    },
    {
      "id": "shape5348n",
      "bone": "bone35bhe",
      "kind": "poly",
      "z": 9.5,
      "fill": "wood",
      "pts": [
        [
          -186,
          -10
        ],
        [
          586,
          4
        ],
        [
          586,
          9
        ],
        [
          -188,
          -3
        ]
      ],
      "hidden": true,
      "label": "spear.shaft",
      "icon": "🥢",
      "merge": true,
      "mergeGroup": "spear"
    },
    {
      "id": "shapenytyv",
      "bone": "bone35bhe",
      "kind": "poly",
      "z": 9.5,
      "fill": "Fur",
      "pts": [
        [
          556,
          24
        ],
        [
          533,
          6
        ],
        [
          555,
          -11
        ],
        [
          637,
          4
        ]
      ],
      "hidden": true,
      "label": "Spear.Edge",
      "icon": "🔪",
      "merge": true,
      "mergeGroup": "spear"
    },
    {
      "id": "shapee0wz6",
      "bone": "bonecxzjy",
      "kind": "poly",
      "z": 10,
      "fill": "wood",
      "pts": [
        [
          -53,
          4
        ],
        [
          211,
          -1
        ],
        [
          196,
          7
        ],
        [
          -5,
          7
        ]
      ],
      "mergeGroup": "stick",
      "merge": true,
      "hidden": true
    },
    {
      "id": "shape49ihi",
      "bone": "bonecxzjy",
      "kind": "poly",
      "z": 10,
      "fill": "wood",
      "pts": [
        [
          163,
          -9
        ],
        [
          90,
          11
        ],
        [
          73,
          13
        ],
        [
          96,
          -12
        ],
        [
          119,
          -11
        ],
        [
          193,
          13
        ],
        [
          204,
          -5
        ],
        [
          168,
          -14
        ]
      ],
      "mergeGroup": "stick",
      "merge": true,
      "hidden": true
    },
    {
      "id": "shape68tki",
      "bone": "bone3im6l",
      "kind": "poly",
      "z": 25,
      "fill": "root",
      "pts": [
        [37, 8],
        [59, -21],
        [51, -70],
        [71, -36],
        [84, 24],
        [80, 65],
        [50, 73],
        [30, 39]
      ],
      "label": "root",
      "icon": "🫚",
      "hidden": true
    },
    {
      "id": "shapedv8qu",
      "bone": "bone3im6l",
      "kind": "poly",
      "z": 26,
      "fill": "greens",
      "pts": [
        [51, 55],
        [68, 54],
        [75, 116],
        [66, 95],
        [43, 99],
        [49, 84]
      ],
      "label": "tops",
      "icon": "🥬",
      "hidden": true
    }
  ],
  "actions": {
    "idle": {
      "dur": 3,
      "loop": true,
      "keys": [
        {
          "t": 0,
          "pose": {
            "angles": {
              "armUpperL": 123.8,
              "armUpperR": 107.5,
              "head": 0,
              "armLowerL": -53.6,
              "armLowerR": -244,
              "boneox6op": 89.8,
              "bonef3y1l": 64.6
            },
            "root": {
              "x": 0,
              "y": -1.4770045466545252,
              "r": 0
            },
            "visible": {
              "shape5a485": true,
              "shapexwqak": true,
              "spearShaft": false,
              "spearTip": false
            }
          }
        },
        {
          "t": 0.86,
          "pose": {
            "angles": {
              "armUpperL": 121.5629412285929,
              "armUpperR": 104.91819640760325,
              "head": 1.3245061774464228,
              "armLowerL": -50.93456827236603,
              "armLowerR": -240.662244432835,
              "boneox6op": 89.8,
              "bonef3y1l": 64.6
            },
            "root": {
              "x": 0,
              "y": -0.7739947644201308,
              "r": 0
            },
            "visible": {
              "spearShaft": false,
              "spearTip": false
            }
          }
        },
        {
          "t": 1.65,
          "pose": {
            "angles": {
              "armUpperL": 119.57756070620972,
              "armUpperR": 102.62685626469796,
              "head": 2.5,
              "armLowerL": -48.56900850101586,
              "armLowerR": -237.7
            },
            "root": {
              "x": 0,
              "y": -0.15007645412240928,
              "r": 0
            }
          }
        }
      ]
    },
    "walk": {
      "dur": 1,
      "loop": true,
      "keys": [
        {
          "t": 0,
          "pose": {
            "angles": {
              "legUpperL": 97.7,
              "legLowerL": -3.6,
              "legUpperR": 72.2,
              "legLowerR": 5.2,
              "armUpperL": 87.4,
              "armUpperR": 78.7,
              "head": -1,
              "armLowerR": 0.5,
              "armLowerL": -98,
              "boneox6op": 87.3
            },
            "root": {
              "x": 0,
              "y": -0.00276960614834456,
              "r": 0
            }
          }
        },
        {
          "t": 0.57,
          "pose": {
            "angles": {
              "legUpperL": 84.7,
              "legLowerL": -25.3,
              "legUpperR": 87,
              "legLowerR": -0.20000000000000018,
              "armUpperL": 129.1,
              "armUpperR": 31.8,
              "head": 1,
              "armLowerR": 119.6,
              "armLowerL": -51,
              "boneox6op": 89.3
            },
            "root": {
              "x": 0,
              "y": -6,
              "r": 0
            }
          }
        }
      ]
    },
    "wave": {
      "dur": 0.7,
      "loop": true,
      "keys": [
        {
          "t": 0,
          "pose": {
            "angles": {
              "armUpperR": -46,
              "armLowerR": -89.1,
              "armLowerL": -51.1,
              "armUpperL": 135
            },
            "root": {},
            "visible": {
              "mouthOpen": true
            }
          }
        },
        {
          "t": 0.38,
          "pose": {
            "angles": {
              "armUpperR": -52.2,
              "armLowerR": -72.6,
              "armLowerL": -53.7,
              "armUpperL": 134
            },
            "root": {
              "x": 0,
              "y": 0,
              "r": 0
            },
            "visible": {
              "mouthOpen": true,
              "mouth": false
            }
          }
        }
      ]
    },
    "scratch head": {
      "dur": 1.5,
      "loop": true,
      "keys": [
        {
          "t": 0,
          "pose": {
            "angles": {
              "armLowerL": 97.1,
              "armUpperL": -111.7,
              "boneox6op": 89.6,
              "head": 6,
              "armUpperR": 78.3,
              "armLowerR": 11.3
            },
            "root": {}
          }
        },
        {
          "t": 0.75,
          "pose": {
            "angles": {
              "armLowerL": 85.2,
              "armUpperL": -99.96766749582488,
              "boneox6op": 88.81784449972166,
              "head": 7.4,
              "armUpperR": 80.3,
              "armLowerR": 5.9
            },
            "root": {
              "x": 0,
              "y": 0,
              "r": 0
            }
          }
        }
      ]
    },
    "talk": {
      "dur": 1.5,
      "loop": true,
      "keys": [
        {
          "t": 0,
          "pose": {
            "angles": {
              "head": 0,
              "armUpperL": 140.5,
              "armLowerL": -53.2,
              "armUpperR": 44.5,
              "armLowerR": 42.1,
              "boneox6op": 89.1
            },
            "root": {},
            "visible": {
              "mouth": true,
              "mouthOpen": false
            }
          }
        },
        {
          "t": 0.25,
          "pose": {
            "angles": {
              "head": 3.5,
              "armUpperL": 143,
              "armLowerL": -49,
              "armUpperR": 41,
              "armLowerR": 46,
              "boneox6op": 90
            },
            "root": {},
            "visible": {
              "mouth": false,
              "mouthOpen": true
            }
          }
        },
        {
          "t": 0.5,
          "pose": {
            "angles": {
              "head": -2,
              "armUpperL": 105.3,
              "armLowerL": -83.8,
              "armUpperR": 47,
              "armLowerR": 68.2,
              "boneox6op": 88.5
            },
            "root": {
              "x": 0,
              "y": 0,
              "r": 0
            },
            "visible": {
              "mouth": true,
              "mouthOpen": false
            }
          }
        },
        {
          "t": 0.75,
          "pose": {
            "angles": {
              "head": 4,
              "armUpperL": 115.2,
              "armLowerL": -117.6,
              "armUpperR": 40,
              "armLowerR": 47,
              "boneox6op": 90.3
            },
            "root": {
              "x": 0,
              "y": 0,
              "r": 0
            },
            "visible": {
              "mouth": false,
              "mouthOpen": true
            }
          }
        },
        {
          "t": 1,
          "pose": {
            "angles": {
              "head": -3,
              "armUpperL": 137.5,
              "armLowerL": -57,
              "armUpperR": 48,
              "armLowerR": 38,
              "boneox6op": 88.19999999999999
            },
            "root": {},
            "visible": {
              "mouth": true,
              "mouthOpen": false
            }
          }
        },
        {
          "t": 1.11,
          "pose": {
            "angles": {
              "head": -0.8613708803677635,
              "armUpperL": 139.42476620766902,
              "armLowerL": -54.433645056441314,
              "armUpperR": 45.64750796840454,
              "armLowerR": 40.566354943558686,
              "boneox6op": 88.79881615349701,
              "bone35bhe": -114.4
            },
            "root": {
              "x": 0,
              "y": 0,
              "r": 0
            },
            "visible": {
              "mouth": true,
              "mouthOpen": false
            }
          }
        },
        {
          "t": 1.24,
          "pose": {
            "angles": {
              "head": 2,
              "armUpperL": 142,
              "armLowerL": -51,
              "armUpperR": 42.5,
              "armLowerR": 44,
              "boneox6op": 89.6
            },
            "root": {},
            "visible": {
              "mouth": false,
              "mouthOpen": true
            }
          }
        }
      ]
    },
    "hunt": {
      "dur": 1.1,
      "loop": false,
      "keys": [
        {
          "t": 0,
          "pose": {
            "angles": {
              "head": 5,
              "armUpperR": 82.1,
              "armLowerR": -84.7,
              "armUpperL": 143.5,
              "armLowerL": -125.3,
              "boneox6op": 88.5,
              "legUpperR": 72.2,
              "legLowerR": 15.6,
              "legUpperL": 102.1,
              "legLowerL": -9.5,
              "bone35bhe": -16.5
            },
            "root": {
              "x": -6
            },
            "visible": {
              "spearShaft": true,
              "spearTip": true,
              "shape5348n": true,
              "shapenytyv": true
            }
          }
        },
        {
          "t": 0.09,
          "pose": {
            "angles": {
              "head": 3.325779274582716,
              "armUpperR": 60,
              "armLowerR": -47.9,
              "armUpperL": 75.7,
              "armLowerL": -61.8,
              "boneox6op": 88.66742207254173,
              "legUpperR": 71.79256030472389,
              "legLowerR": 19.38336859899246,
              "legUpperL": 102.93428128080346,
              "legLowerL": -8.025456340905505,
              "bone35bhe": -15.2
            },
            "root": {
              "x": -3.0236075992581615,
              "y": 0,
              "r": 0
            },
            "visible": {
              "spearShaft": true,
              "spearTip": true,
              "mouth": true,
              "mouthOpen": true
            }
          }
        },
        {
          "t": 0.21,
          "pose": {
            "angles": {
              "head": -3.629162951326311,
              "armUpperR": 16.1,
              "armLowerR": 1.7,
              "armUpperL": 34.2,
              "armLowerL": -24.3,
              "boneox6op": 89.36291629513264,
              "legUpperR": 70.1,
              "legLowerR": 35.1,
              "legUpperL": 106.4,
              "legLowerL": -1.9,
              "bone35bhe": -12
            },
            "root": {
              "x": 9.340734135691221,
              "y": 0,
              "r": 0
            },
            "visible": {
              "spearShaft": true,
              "spearTip": true,
              "shape5348n": true,
              "shapenytyv": true
            }
          }
        },
        {
          "t": 0.31,
          "pose": {
            "angles": {
              "head": -4,
              "armUpperR": 15,
              "armLowerR": -8.8,
              "armUpperL": 60.2,
              "armLowerL": -59,
              "boneox6op": 89.4,
              "legUpperR": 72.7,
              "legLowerR": 22.9,
              "legUpperL": 104.7,
              "legLowerL": -15,
              "bone35bhe": -9.7
            },
            "root": {
              "x": 10,
              "y": 0,
              "r": 0
            },
            "visible": {
              "spearShaft": true,
              "spearTip": true,
              "shape5348n": true,
              "shapenytyv": true,
              "mouth": true,
              "mouthOpen": false
            }
          }
        },
        {
          "t": 0.63,
          "pose": {
            "angles": {
              "head": -3,
              "armUpperR": 30.1,
              "armLowerR": -21.7,
              "armUpperL": 51.7,
              "armLowerL": -45.6,
              "boneox6op": 87.6,
              "legUpperR": 70.7,
              "legLowerR": 10.1,
              "legUpperL": 106.1,
              "legLowerL": -21.6,
              "bone35bhe": -10.4
            },
            "root": {
              "x": 9,
              "y": 0,
              "r": 0
            },
            "visible": {
              "spearShaft": true,
              "spearTip": true,
              "shape5348n": true,
              "shapenytyv": true,
              "mouthOpen": true
            }
          }
        },
        {
          "t": 0.95,
          "pose": {
            "angles": {
              "head": 1,
              "armUpperR": 46.4,
              "armLowerR": -17.3,
              "armUpperL": 110.9,
              "armLowerL": -92.4,
              "boneox6op": 89.1,
              "legUpperR": 77.2,
              "legLowerR": 11.6,
              "legUpperL": 100.1,
              "legLowerL": -8.5,
              "bone35bhe": -17.7
            },
            "root": {
              "x": 0,
              "y": 0,
              "r": 0
            },
            "visible": {
              "spearShaft": true,
              "spearTip": true,
              "shape5348n": true,
              "shapenytyv": true,
              "mouthOpen": true,
              "mouth": false
            }
          }
        }
      ]
    },
    "dig": {
      "dur": 0.9,
      "loop": true,
      "keys": [
        {
          "t": 0,
          "pose": {
            "angles": {
              "legUpperL": 81.3,
              "legLowerL": -33.7,
              "legUpperR": 2.9,
              "legLowerR": 136.3,
              "armUpperL": 127.4,
              "armLowerL": -24.4,
              "head": -8,
              "armUpperR": -5,
              "armLowerR": 52.4
            },
            "root": {
              "x": 0,
              "y": 19,
              "r": 38
            },
            "visible": {
              "shapee0wz6": true,
              "shape49ihi": true
            }
          }
        },
        {
          "t": 0.27,
          "pose": {
            "angles": {
              "legUpperL": 77.5,
              "legLowerL": -33.7,
              "legUpperR": -3.6999999999999997,
              "legLowerR": 136.3,
              "armUpperL": 78.3,
              "armLowerL": -22.4,
              "head": -8,
              "armUpperR": -30.4,
              "armLowerR": 75.7
            },
            "root": {
              "x": 0,
              "y": 19,
              "r": 45
            },
            "visible": {}
          }
        },
        {
          "t": 0.6,
          "pose": {
            "angles": {
              "legUpperL": 81.3,
              "legLowerL": -33.7,
              "legUpperR": 2.9,
              "legLowerR": 136.3,
              "armUpperL": 28.9,
              "armLowerL": -24.4,
              "head": -8,
              "armUpperR": -5,
              "armLowerR": 40.3,
              "boneox6op": 89.4
            },
            "root": {
              "x": 0,
              "y": 19,
              "r": 38
            },
            "visible": {}
          }
        }
      ]
    },
    "eat": {
      "dur": 1.5,
      "loop": true,
      "keys": [
        {
          "t": 0.01,
          "pose": {
            "angles": {
              "armLowerL": -70.7,
              "armUpperL": 120.5,
              "armLowerR": 95.6,
              "armUpperR": 56.4
            },
            "root": {},
            "visible": {
              "shape68tki": true,
              "shapedv8qu": true
            }
          }
        },
        {
          "t": 0.41,
          "pose": {
            "angles": {
              "armLowerL": -70.7,
              "armUpperL": 108.3,
              "armLowerR": 113.30000000000004,
              "armUpperR": 82.8
            },
            "root": {
              "x": 0,
              "y": 0,
              "r": 0
            },
            "visible": {
              "mouthOpen": true
            }
          }
        },
        {
          "t": 0.79,
          "pose": {
            "angles": {
              "armLowerL": -60.5,
              "armUpperL": 113.1,
              "armLowerR": 93.2,
              "armUpperR": 75.41134569187254
            },
            "root": {
              "x": 0,
              "y": 0,
              "r": 0
            }
          }
        },
        {
          "t": 1.01,
          "pose": {
            "angles": {
              "armLowerL": -70.7,
              "armUpperL": 112.5,
              "armLowerR": 93.74848942893624,
              "armUpperR": 71.06654479943727
            },
            "root": {
              "x": 0,
              "y": 0,
              "r": 0
            }
          }
        },
        {
          "t": 1.22,
          "pose": {
            "angles": {
              "armLowerL": -45.7,
              "armUpperL": 100,
              "armLowerR": 94.47721807935491,
              "armUpperR": 65.29399801248675
            },
            "root": {
              "x": 0,
              "y": 0,
              "r": 0
            }
          }
        }
      ]
    }
  },
  "merge": true,
  "name": "Caveman-1.0",
  "mergeGroupColors": {
    "body": "#8659b5",
    "head": "#b5457a",
    "armL": "#3a8f5c",
    "armR": "#c25a3a",
    "Spear": "#8659b5",
    "spear": "#c98a1f",
    "stick": "#a0522d"
  }
};
export default model;
