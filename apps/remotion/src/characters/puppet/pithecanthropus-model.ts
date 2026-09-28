// puppet-model.js — exported from Puppet Studio 2026-09-28
export const model = {
  "viewBox": "-200 -40 400 560",
  "colors": {
    "ink": "#3b3a37",
    "skin": "#e9e2d2",
    "hair": "#38372e",
    "fur": "#8f8676"
  },
  "bones": [
    {
      "id": "root",
      "parent": null,
      "x": 96,
      "y": 189,
      "angle": 0,
      "len": 0,
      "z": 0
    },
    {
      "id": "head",
      "parent": "root",
      "x": 4,
      "y": -192,
      "angle": 0,
      "len": 0,
      "z": 20
    },
    {
      "id": "armUpperL",
      "parent": "root",
      "x": -83,
      "y": -146,
      "angle": 127.9,
      "len": 93,
      "drawAs": "limb",
      "width": 45,
      "z": 6
    },
    {
      "id": "armLowerL",
      "parent": "armUpperL",
      "x": 1,
      "y": -1,
      "angle": -38,
      "len": 77,
      "drawAs": "limb",
      "width": 45,
      "z": 12
    },
    {
      "id": "armUpperR",
      "parent": "root",
      "x": 91,
      "y": -137,
      "angle": 44.5,
      "len": 89,
      "drawAs": "limb",
      "width": 50,
      "z": 6
    },
    {
      "id": "armLowerR",
      "parent": "armUpperR",
      "x": 0,
      "y": 0,
      "angle": 43.9,
      "len": 81,
      "drawAs": "limb",
      "width": 45,
      "z": 11
    },
    {
      "id": "legUpperL",
      "parent": "root",
      "x": -43,
      "y": 8,
      "angle": 106.7,
      "len": 110,
      "drawAs": "limb",
      "width": 50,
      "z": 2
    },
    {
      "id": "legLowerL",
      "parent": "legUpperL",
      "x": 1,
      "y": -3,
      "angle": -16.7,
      "len": 99,
      "drawAs": "limb",
      "width": 40,
      "z": -4
    },
    {
      "id": "legUpperR",
      "parent": "root",
      "x": 43,
      "y": 18,
      "angle": 71.9,
      "len": 100,
      "drawAs": "limb",
      "width": 50,
      "z": 2
    },
    {
      "id": "legLowerR",
      "parent": "legUpperR",
      "x": 0,
      "y": 0,
      "angle": 17.4,
      "len": 102,
      "drawAs": "limb",
      "width": 40,
      "z": 2
    }
  ],
  "shapes": [
    {
      "id": "torso",
      "bone": "root",
      "kind": "poly",
      "z": 5,
      "fill": "skin",
      "pts": [
        [
          -88,
          -160
        ],
        [
          -59,
          6
        ],
        [
          62,
          4
        ],
        [
          92,
          -156
        ],
        [
          55,
          -179
        ],
        [
          31,
          -216
        ],
        [
          -28,
          -221
        ],
        [
          -48,
          -187
        ]
      ]
    },
    {
      "id": "cloth",
      "bone": "root",
      "kind": "poly",
      "z": 6,
      "fill": "fur",
      "pts": [
        [
          7,
          -56
        ],
        [
          43,
          -184
        ],
        [
          71,
          9
        ],
        [
          93,
          83
        ],
        [
          43,
          63
        ],
        [
          27,
          118
        ],
        [
          -20,
          64
        ],
        [
          -39,
          78
        ],
        [
          -59,
          56
        ],
        [
          -94,
          85
        ],
        [
          -64,
          -7
        ]
      ]
    },
    {
      "id": "shapena72s",
      "bone": "legLowerL",
      "kind": "poly",
      "z": 10,
      "fill": "skin",
      "pts": [
        [
          118,
          -39
        ],
        [
          98,
          -19
        ],
        [
          98,
          19
        ],
        [
          121,
          37
        ]
      ]
    },
    {
      "id": "shapeovocp",
      "bone": "legLowerR",
      "kind": "poly",
      "z": 10,
      "fill": "skin",
      "pts": [
        [
          123,
          -33
        ],
        [
          101,
          -18
        ],
        [
          102,
          21
        ],
        [
          121,
          36
        ]
      ]
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
          55,
          39
        ],
        [
          9,
          52
        ],
        [
          -8,
          53
        ],
        [
          -58,
          39
        ],
        [
          -28,
          -38
        ]
      ]
    },
    {
      "id": "hair",
      "bone": "head",
      "kind": "poly",
      "z": 21,
      "fill": "hair",
      "pts": [
        [
          -13,
          -33
        ],
        [
          -24,
          -36
        ],
        [
          -49,
          -20
        ],
        [
          -24,
          -41
        ],
        [
          -68,
          -46
        ],
        [
          -27,
          -44
        ],
        [
          -18,
          -48
        ],
        [
          -34,
          -62
        ],
        [
          -13,
          -50
        ],
        [
          -14,
          -66
        ],
        [
          -3,
          -49
        ],
        [
          18,
          -47
        ],
        [
          36,
          -63
        ],
        [
          21,
          -47
        ],
        [
          59,
          -41
        ],
        [
          29,
          -42
        ],
        [
          30,
          -35
        ],
        [
          -7,
          -35
        ],
        [
          -19,
          -21
        ]
      ]
    },
    {
      "id": "earL",
      "bone": "head",
      "kind": "circle",
      "z": 19,
      "fill": "skin",
      "cx": -60,
      "cy": 0,
      "r": 11
    },
    {
      "id": "earR",
      "bone": "head",
      "kind": "circle",
      "z": 19,
      "fill": "skin",
      "cx": 60,
      "cy": 0,
      "r": 11
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
          -40,
          -6
        ],
        [
          -14,
          -3
        ],
        [
          -14,
          1
        ],
        [
          -40,
          -2
        ]
      ]
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
          -6
        ],
        [
          14,
          -3
        ],
        [
          14,
          1
        ],
        [
          40,
          -2
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
      "cx": -26,
      "cy": 6,
      "r": 4
    },
    {
      "id": "eyeR",
      "bone": "head",
      "kind": "circle",
      "z": 22,
      "fill": "ink",
      "stroke": false,
      "cx": 26,
      "cy": 6,
      "r": 4
    },
    {
      "id": "nose",
      "bone": "head",
      "kind": "poly",
      "z": 22,
      "fill": "skin",
      "pts": [
        [
          -8,
          4
        ],
        [
          -12,
          26
        ],
        [
          12,
          26
        ],
        [
          8,
          4
        ]
      ]
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
          -18,
          34
        ],
        [
          18,
          34
        ],
        [
          18,
          37
        ],
        [
          -18,
          37
        ]
      ]
    },
    {
      "id": "shapehpyuy",
      "bone": "armLowerL",
      "z": 10,
      "fill": "skin",
      "kind": "circle",
      "cx": 81,
      "cy": -23,
      "r": 8
    },
    {
      "id": "shape5a485",
      "bone": "armLowerR",
      "z": 10,
      "fill": "skin",
      "kind": "circle",
      "cx": 82,
      "cy": 21,
      "r": 8
    },
    {
      "id": "shape9k3hj",
      "bone": "armLowerR",
      "z": 10,
      "fill": "skin",
      "kind": "circle",
      "cx": 101,
      "cy": 10,
      "r": 8
    },
    {
      "id": "shapepy1qf",
      "bone": "armLowerR",
      "z": 10,
      "fill": "skin",
      "kind": "circle",
      "cx": 103,
      "cy": -8,
      "r": 8
    },
    {
      "id": "shapeugpyx",
      "bone": "armLowerL",
      "z": 10,
      "fill": "skin",
      "kind": "circle",
      "cx": 98,
      "cy": -9,
      "r": 8
    },
    {
      "id": "shape7vczj",
      "bone": "armLowerL",
      "z": 10,
      "fill": "skin",
      "kind": "circle",
      "cx": 94,
      "cy": 15,
      "r": 8
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
              "armUpperL": 109.3,
              "armUpperR": 119.7,
              "head": 3,
              "armLowerL": -53.6,
              "armLowerR": -257.3
            },
            "root": {
              "x": 0,
              "y": -1.4770045466545252,
              "r": 0
            }
          }
        },
        {
          "t": 1.86,
          "pose": {
            "angles": {
              "armUpperL": 109.3,
              "armUpperR": 113.3,
              "head": 3,
              "armLowerL": -53.6,
              "armLowerR": -249.1
            },
            "root": {
              "x": 0,
              "y": -1.6810236953044765e-31,
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
              "legUpperL": 89.5,
              "legLowerL": 23.2,
              "legUpperR": 44.9,
              "legLowerR": 53.1,
              "armUpperL": 102,
              "armUpperR": 50.2,
              "head": 0,
              "armLowerR": -70.2,
              "armLowerL": -98
            },
            "root": {
              "y": 0
            }
          }
        },
        {
          "t": 0.09,
          "pose": {
            "angles": {
              "legUpperL": 104.9,
              "legLowerL": 35.1,
              "legUpperR": 87.3,
              "legLowerR": -1.2,
              "armUpperL": 129.1,
              "armUpperR": 75.5,
              "head": 0,
              "armLowerR": -83.5
            },
            "root": {
              "x": 0,
              "y": -6,
              "r": 0
            }
          }
        },
        {
          "t": 0.17,
          "pose": {
            "angles": {
              "legUpperL": 89.5,
              "legLowerL": 23.2,
              "legUpperR": 44.9,
              "legLowerR": 53.1,
              "armUpperL": 102,
              "armUpperR": 50.2,
              "head": 0,
              "armLowerR": -70.2,
              "armLowerL": -98
            },
            "root": {
              "y": 0
            }
          }
        },
        {
          "t": 1,
          "pose": {
            "angles": {
              "legUpperL": 78,
              "legLowerL": 14,
              "legUpperR": 102,
              "legLowerR": 2,
              "armUpperL": 102,
              "armUpperR": 72,
              "head": 0
            },
            "root": {
              "y": 0
            }
          }
        }
      ]
    },
    "wave": {
      "dur": 1.4,
      "loop": true,
      "keys": [
        {
          "t": 0,
          "pose": {
            "angles": {
              "armUpperR": -46,
              "armLowerR": 26
            }
          }
        },
        {
          "t": 0.35,
          "pose": {
            "angles": {
              "armUpperR": -46,
              "armLowerR": -16
            }
          }
        },
        {
          "t": 0.7,
          "pose": {
            "angles": {
              "armUpperR": -46,
              "armLowerR": 26
            }
          }
        },
        {
          "t": 1.05,
          "pose": {
            "angles": {
              "armUpperR": -46,
              "armLowerR": -16
            }
          }
        },
        {
          "t": 1.4,
          "pose": {
            "angles": {
              "armUpperR": -46,
              "armLowerR": 26
            }
          }
        }
      ]
    }
  }
};
export default model;
