//features/admin/workout/create/components/ExerciseSelector.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const exerciseData = {
  bodyParts: ['chest', 'shoulder', 'latz', 'biceps', 'trapz', 'triceps', 'cardio', 'abdominals', 'legs', 'hiit'],
  subParts: {
    chest: [
      'incline_press',
      'incline_dumbbell',
      'bench_press',
      'dumbbell',
      'decline_press',
      'decline_dumbbell',
      'chest_press',
      'pec_dec_fly',
      'dips',
      'chest_dip',
      'cross_over',
      'cable_fly',
      'cable_press',
      'around_the_world_chest_fly'
    ],
    shoulder: [
      'front_press',
      'dumbbell_front_press',
      'side_laterals',
      'arnold_press',
      'front_raise',
      'cable_rear_delt',
      'bent_over_reverse_fly',
      'shoulder_press',
      'dumbbell_front_flys',
      'dumbbell_front_raise',
      'dumbbell_lat_flys',
      'dumbbell_upright_rows'
    ],
    latz: [
      'pull_ups',
      'lat_full_front',
      'barbell_rows',
      'deadlift',
      'dumbbell_rows',
      'one_arm_rows',
      'one_arm_cable_rows',
      't_bar_rows',
      'face_pull'
    ],
    biceps: [
      'bicep_curls',
      'z_bar_curls',
      'dumbbell_curls',
      'alternate_curls',
      'concentration_curls',
      'preacher_curls',
      'machine_curls',
      'hammer_curls',
      'cross_over_cable_curls',
      'zottman_curls',
      'overhead_cable_curls',
      'unisorn_curls',
      'reverse_curls',
      'kneeling_single_arm_curls',
      'lying_preacher_curls',
      'chin_ups',
      'for_arms',
      'for_arms_reverse'
    ],
    trapz: [
      'barbell_shrug',
      'upright_rows',
      'bent_arm_laterals',
      'back_press',
      'standing_rear_deltoids',
      'bent_over_raise',
      'shrug_pullups',
      'rack_pull',
      'snatchgrip_barbell',
      'scaptions',
      'rear_delt_machine'
    ],
    triceps: [
      'triceps_press',
      'lying_down_triceps_over_head',
      'cable_push_down_rope',
      'dumbbell_kick_back',
      'close_grip_bench_press',
      'one_arm_triceps',
      'seated_machine_dip',
      'triceps_overhead_extension',
      'tri_dips'
    ],
    cardio: [
      'cycling',
      'crosstrainner',
      'treadmil',
      'jumping_rope',
      'fighting_and_dancing',
      'vibrate_belt'
    ],
    abdominals: [
      'side_bents',
      'flecther_kick',
      'twist_machine',
      'ab_coaster',
      'abs_machine',
      'patal_bar_kg_raise',
      'leg_raise',
      'bicycle_crunch',
      'high_knees',
      'plank_hold',
      'side_plank_hold_both_side',
      'mountain_crunch',
      'reverse_crunch',
      'standing_crunches',
      'dead_bug',
      'situps',
      'russian_twist',
      'hanging_knee_raise',
      'hollow_hold',
      'pall_of_press',
      'bird_dog_exercise',
      'leg_drops',
      'cable_standing_oblique_twists',
      'cable_wood_chopper(low_to_high)',
      'cable_side_bents',
      'kneeling_cable_crunch',
      'high_plank_knee_to_chest',
      'high_plank_knee_to_elbow'
    ],
    hiit: [
      'deadlift',
      'push_ups',
      'clean_and_press',
      'burpees_box/Ovwe_dumbbell', // need attension
      'rope',
      'jumping_jack',
      'farmer_walk',
      'walking_lunges',
      'ladder_drills',
      'cone_drills',
      'high_knee_run',
      'bicycle_crunch',
      'jump_in',
      'jumping_lunges',
      'power_push_ups',
      'laterals_jump',
      'jumping_climber',
      'foot_taps',
      'glute_kicks',
      'mountain_climbs',
      'tuck_jump',
      'thrusters',
      'devil_press',
      'jumping_press',
      'jog_on_spot',
      'ground_to_overhead',
      'running_punches',
      'squat_lateral_raise',
      'squat_jack_curls',
    ],
    legs: [
      'leg_curls',
      'leg_extension',
      'squats',
      'lunges',
      'hack_squats',
      'super_squats',
      'inner_thigh',
      'romanian_deadlift',
      'bulgarian_split_squat',
      'dumbbell_squat',
      'hip_thrust',
      'single_leg_glute',
      'wall_squat',
      'sissy_squat',
      'calfraise_leg_press',
      'goblet_squat_with_lunges',
      'over_head_squat',
      'pistol_squat',
      'box_squat',
      'leg_press',
      'glute_bridge',
      'standing_adduction',
      'clamsnell',
      'planter_flexion',
      'lateral_band_walk',
      'hip_thrusts',
      'abduction',
      'calf_raise',
      'calf_raise'
    ]

  },
  exercises: {
    calf_raise: ['dumbbell', 'barbell', 'smith', 'machine', 'close', 'wide', 'middle', 'legpress', 'super squat'],
    abduction: ['standing', 'seated'],
    leg_press: ['inner', 'outer', 'hams', 'quadas'],
    box_squat: ['single leg'],
    calfraise_leg_press: ['super squats', 'machine dumbbell', 'smith', 'wide', 'middle', 'close'],
    single_leg_glute: ['cable', 'dumbbell'],
    hip_thrust: ['barbell'],
    super_squats: ['front', 'back', 'wide', 'close', 'with out bending legs'],
    lunges: ['barbell', 'dumbbell', 'walking', 'reverse', 'overhead'],
    squats: ['wide', 'close', 'front', 'back', 'pause','jump', 'sumo'],
    leg_extension: ['only by one'],
    leg_curls: ['close', 'regular', 'wide', 'one by one'],
    clean_and_press: ['barbell', 'dumbbell'],
  //  deadlift: ['barbell', 'dumbbell'],
    situps: ['half', 'full'],
    dead_bug: ['dumbbell', 'barbell'],
    leg_raise: ['flat', 'decline', 'flat and decline', 'swing'],
    ab_coaster: ['front', 'side'],
    patal_bar_kg_raise: ['front', 'side'],
    side_bents: ['dumbbell', 'cable', 'barbel'],
    cycling: ['before', 'after'],
    triceps_press: ['seated', 'standing'],
    lying_down_triceps_over_head: ['incline', 'decline'],
    cable_push_down_rope: ['reverse', 'bar'],
    dumbbell_kick_back: ['seated', 'standing', 'cable'],
    close_grip_bench_press: [],
    one_arm_triceps: [],
    seated_machine_dip: [],
    triceps_overhead_extension: ['bar','rope'],
    tri_dips: ['normal','machine'],
    barbell_shrug: ['reverse', 'Dumbbell', 'Front', 'Back'],
    upright_rows: ['Barbell', 'Zbar', 'Dumbell', 'Cable', 'One arm'],
    bent_arm_laterals: ['Cable', 'Dumbell', 'Incline'],
    back_press: ['Close', 'Wide', 'Standing', 'Seated'],
    standing_rear_deltoids: ['Standing', 'Seated'],
    bent_over_raise: [],
    shrug_pullups: ['Jump', 'Over head', 'machine'],
    rack_pull: [],
    snatchgrip_barbell: ['high pull'],
    scaptions: [],
    rear_delt_machine: [],
    bicep_curls: ['Close', 'wide', 'regular', 'Negative'],
    z_bar_curls: ['Close', 'wide', 'Curve', 'Negative'],
    dumbbell_curls: ['Seated', 'Standing', 'Incline', 'Decline'],
    alternate_curls: ['Seated', 'Standing', 'Incline', 'Decline'],
    concentration_curls: [],
    preacher_curls: ['Close', 'Wide', 'E2 bar', 'Dumbell'],
    machine_curls: ['Close', 'Wide'],
    hammer_curls: ['standing', 'Seated', 'Incline', 'Cable rope'],
    cross_over_cable_curls: ['close', 'One arm', 'Booth arm'],
    zottman_curls: [],
    overhead_cable_curls: [],
    unisorn_curls: [],
    reverse_curls: ['Z Bar', 'Dumbell', 'Cable'],
    kneeling_single_arm_curls: [],
    lying_preacher_curls: [],
    chin_ups: [],
    for_arms: ['barbell', 'Dumbell', 'Cable'],
    for_arms_reverse: ['barbell', 'Dumbell', 'Cable'],
    pull_ups: ['wide', 'close', 'reverse machine'],
    lat_full_front: ['wide', 'Narrow', 'close', 'Reverse', 'One arm'],
    barbell_rows: ['reverse', 'Wide', 'Regular', 'Close', 'Smith'],
    deadlift: ['Normal', 'reverse', 'Barbell', 'Dumbell'],
    dumbbell_rows: ['rows', 'Natural Incline', 'Wide', 'Close', 'Reverse'],
    one_arm_rows: ['dumbell', 'Barbell', 'Netura', 'Reverse'],
    one_arm_cable_rows: ['Neutral', 'Regular', 'Wide', 'Reverse'],
    t_bar_rows: ['Wide', 'Close', 'Reverse'],
    face_pull: ['Rope', 'Bar', 'Incline'],
    incline_press: ['machine', 'smith', 'close', 'wide'],
    incline_dumbbell: ['press', 'fly', 'neutral', 'single arm', 'wide'],
    bench_press: ['machine', 'smith', 'reverse close', 'wide', 'close'],
    dumbbell: ['press', 'fly', 'neutral', 'single arm', 'wide', 'close'],
    decline_press: ['close', 'wide', 'smith'],
    decline_dumbbell: ['press', 'fly', 'wide', 'neutral', 'close', 'cable'],
    chest_press: ['wide', 'close'],
    pec_dec_fly: [],
    dips: ['wide', 'close', 'flat incline', 'decline'],
    chest_dip: [],
    cross_over: ['upper', 'middle', 'lower', 'chest', 'dip', 'fly'],
    cable_fly: ['flat', 'incline', 'decline', 'press'],
    cable_press: ['seated', 'standing', 'fly', 'incline', 'talt'],
    around_the_world_chest_fly: [],
    front_press: ['seated', 'standing', 'z bar', 'close wide', 'regular', '60'],
    dumbbell_front_press: ['seated', 'standing', 'close', 'wide', 'one by one arm', '60'],
    side_laterals: ['seated', 'standing', 'cable', 'one arm'],
    arnold_press: ['seated', 'standing'],
    front_raise: ['dumbbell', 'barbell', 'cable', 'reverse', 'close', 'neutral', 'incline'],
    cable_rear_delt: ['standing', 'bentarm'],
    bent_over_reverse_fly: ['cable', 'dumbbell'],
    shoulder_press: ['close', 'wide'],
    dumbbell_front_flys: ['seated', 'standing'],
    dumbbell_front_raise: ['cross body', 'reverse', 'one by one'],
    dumbbell_lat_flys: [],
    dumbbell_upright_rows: ['shoulder level'],

    // Add other sub-parts' exercises here
  }
}

interface ExerciseSelectorProps {
  value: { bodyPart: string; subPart: string; exercise: string; times: number; sets: number }
  onChange: (field: string, value: string | number) => void
  isFirstInGroup: boolean
}

export default function ExerciseSelector({ value, onChange, isFirstInGroup }: ExerciseSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {isFirstInGroup && (
          <Select value={value.bodyPart} onValueChange={(val) => onChange('bodyPart', val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select body part" />
            </SelectTrigger>
            <SelectContent>
              {exerciseData.bodyParts.map((part) => (
                <SelectItem key={part} value={part}>
                  {part}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {value.bodyPart && (
          <Select value={value.subPart} onValueChange={(val) => onChange('subPart', val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select sub-part" />
            </SelectTrigger>
            <SelectContent>
              {exerciseData.subParts[value.bodyPart as keyof typeof exerciseData.subParts]?.map((part) => (
                <SelectItem key={part} value={part}>
                  {part}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {value.subPart && (
          <Select value={value.exercise} onValueChange={(val) => onChange('exercise', val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select exercise" />
            </SelectTrigger>
            <SelectContent>
              {exerciseData.exercises[value.subPart as keyof typeof exerciseData.exercises]?.map((ex) => (
                <SelectItem key={ex} value={ex}>
                  {ex}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {value.exercise && (
        <div className="flex space-x-4">
          <div className="space-y-2">
            <Label htmlFor="times">Times per set</Label>
            <Input
              id="times"
              type="number"
              value={value.times}
              onChange={(e) => onChange('times', parseInt(e.target.value))}
              min={1}
              className="w-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sets">Number of sets</Label>
            <Input
              id="sets"
              type="number"
              value={value.sets}
              onChange={(e) => onChange('sets', parseInt(e.target.value))}
              min={1}
              className="w-[100px]"
            />
          </div>
        </div>
      )}
    </div>
  )
}

