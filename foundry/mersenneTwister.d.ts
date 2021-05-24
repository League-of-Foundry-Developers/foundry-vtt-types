/**
 * A standalone, pure JavaScript implementation of the Mersenne Twister pseudo random number generator.
 *
 * author: Raphael Pigulla \<pigulla\@four66.com\>
 * version: 0.2.3
 * license:
 * Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * 3. The names of its contributors may not be used to endorse or promote
 * products derived from this software without specific prior written
 * permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
declare class MersenneTwister {
  /**
   * Instantiates a new Mersenne Twister.
   * @param seed - The initial seed value, if not provided the current timestamp will be used.
   */
  constructor(seed?: number);

  /**
   * Initializes the state vector by using one unsigned 32-bit integer "seed", which may be zero.
   *
   * since: 0.1.0
   * @param seed - The seed value.
   */
  seed(seed: number): number;

  /**
   * Initializes the state vector by using an array key[] of unsigned 32-bit integers of the specified length. If
   * length is smaller than 624, then each array of 32-bit integers gives distinct initial state vector. This is
   * useful if you want a larger seed space than 32-bit word.
   *
   * since: 0.1.0
   * @param vector - The seed vector.
   */
  seedArray(vector: number[]): void;

  /**
   * Generates a random unsigned 32-bit integer.
   *
   * since: 0.1.0
   */
  int(): number;

  /**
   * Generates a random unsigned 31-bit integer.
   *
   * since: 0.1.0
   */
  int31(): number;

  /**
   * Generates a random real in the interval [0;1] with 32-bit resolution.
   *
   * since: 0.1.0
   */
  real(): number;

  /**
   * Generates a random real in the interval ]0;1[ with 32-bit resolution.
   *
   * since: 0.1.0
   */
  realx(): number;

  /**
   * Generates a random real in the interval [0;1[ with 32-bit resolution.
   *
   * since: 0.1.0
   */
  rnd(): number;

  /**
   * Generates a random real in the interval [0;1[ with 32-bit resolution.
   *
   * Same as .rnd() method - for consistency with Math.random() interface.
   *
   * since: 0.2.0
   * @see {@link MersenneTwister#rnd}
   */
  random(): number;

  /**
   * Generates a random real in the interval [0;1[ with 53-bit resolution.
   *
   * since: 0.1.0
   */
  rndHiRes(): number;

  /**
   * A pseudo-normal distribution using the Box-Muller transform.
   * @param mu    - The normal distribution mean
   * @param sigma - The normal distribution standard deviation
   */
  normal(mu: number, sigma: number): number;

  /**
   * A factory method for generating random uniform rolls
   * @see {@link MersenneTwister#random}
   */
  static random(): number;

  /**
   * A factory method for generating random normal rolls
   * @see {@link MersenneTwister#normal}
   */
  static normal(mu: number, sigma: number): number;
}

declare const twist: MersenneTwister;
