export interface MazePath {
  id: string
  color: "blue" | "green"
  d: string
  duration: number
  delay: number
}

export const sectionTwoGreenPaths: MazePath[] = [
  {
    id: "section2-green-main",
    color: "green",
    d: `
      M 398 31
      C 401 40 406 46 411 52
      L 396 78
      L 396 105
      L 410 105
      L 410 126
      L 444 126
      L 459 145
      L 470 145
      L 470 166
      L 456 166
      L 456 184
      L 430 191
      L 430 202
      L 443 207
      L 443 218
      L 466 218
      L 478 232
      L 478 252
      L 450 252
      L 450 270
      L 440 270
      L 440 289
      L 421 289
      L 421 307
      L 401 307
      L 401 325
      L 382 325
      L 382 344
      L 362 344
      L 362 363
      L 340 363
      L 340 344
    `,
    duration: 1.4,
    delay: 0,
  },

  {
    id: "section2-green-left",
    color: "green",
    d: `
      M 42 552
      L 42 520
      L 42 490
      L 64 466
      L 128 466
      L 149 466
    `,
    duration: 0.8,
    delay: 0.5,
  },

  {
    id: "section2-green-leaf-left",
    color: "green",
    d: `
      M 397 32
      C 390 25 386 18 388 12
    `,
    duration: 0.3,
    delay: 0,
  },

  {
    id: "section2-green-leaf-right",
    color: "green",
    d: `
      M 399 31
      C 407 22 416 20 424 22
      C 424 31 418 39 408 42
    `,
    duration: 0.35,
    delay: 0.05,
  },
]

export const sectionTwoBluePaths: MazePath[] = [
  {
    id: "section2-blue-01",
    color: "blue",
    d: `
      M 369 208
      L 369 229
      L 351 229
    `,
    duration: 0.35,
    delay: 0.15,
  },

  {
    id: "section2-blue-02",
    color: "blue",
    d: `
      M 380 247
      L 380 268
      L 365 281
      L 349 281
    `,
    duration: 0.4,
    delay: 0.2,
  },

  {
    id: "section2-blue-03",
    color: "blue",
    d: `
      M 424 294
      L 424 312
      L 408 312
      L 397 323
      L 397 352
      L 380 352
      L 380 371
      L 351 371
    `,
    duration: 0.5,
    delay: 0.25,
  },

  {
    id: "section2-blue-04",
    color: "blue",
    d: `
      M 838 372
      L 838 390
      L 821 390
      L 811 401
      L 811 420
      L 789 420
    `,
    duration: 0.45,
    delay: 0.3,
  },

  {
    id: "section2-blue-05",
    color: "blue",
    d: `
      M 448 374
      L 448 390
      L 463 390
      L 478 402
      L 478 421
    `,
    duration: 0.45,
    delay: 0.35,
  },

  {
    id: "section2-blue-06",
    color: "blue",
    d: `
      M 716 437
      L 716 419
      L 734 419
      L 747 409
      L 747 389
    `,
    duration: 0.4,
    delay: 0.4,
  },

  {
    id: "section2-blue-07",
    color: "blue",
    d: `
      M 242 646
      L 326 646
    `,
    duration: 0.35,
    delay: 0.5,
  },

  {
    id: "section2-blue-08",
    color: "blue",
    d: `
      M 681 163
      L 696 163
      L 696 180
      L 711 180
      L 711 201
      L 728 201
    `,
    duration: 0.45,
    delay: 0.6,
  },

  {
    id: "section2-blue-09",
    color: "blue",
    d: `
      M 452 296
      L 452 315
      L 470 315
      L 470 332
      L 493 332
    `,
    duration: 0.4,
    delay: 0.7,
  },

  {
    id: "section2-blue-10",
    color: "blue",
    d: `
      M 339 438
      L 339 421
      L 356 421
      L 356 405
      L 374 405
    `,
    duration: 0.4,
    delay: 0.8,
  },
]

